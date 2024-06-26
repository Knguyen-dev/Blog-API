/*
+ The services function (backend):
These should focus on 'business' logic, or logic and information that closely relates 
to your business and is human-readable, usable, and you shouldn't need to know the underlying
logic or innerworkings of how a service/function works in order to use it. It should have a good 
level of abstraction. For example, a service could be a 'loginUser(username, password)'.
This function is very human-readable, you know what it does, and it relates to the business
logic of your code, it logs in a user to your application. In contrast something like get.
*/
import User from "../models/User"
import Post from "../models/Post"
import mongoose from "mongoose"
import { createError } from "../middleware/errorUtils"
import { isValidObjectId } from "mongoose"
import { generatePasswordHash, verifyPassword } from "../middleware/passwordUtils"
import { deleteFromCloudinary } from "../config/cloudinary";
import { roles_map } from "../config/roles_map"
import { IUserDoc } from "../types/User"

// Finds user by ID. Either throws an error or returns a user
const findUserByID = async (id: string, populateOptions: string = "") => {
  
  // Handle case where the user of the user was invalid.
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid user ID");
  }

  // Construct the query
  const query = User.findById(id)
  if (populateOptions) {
    query.populate(populateOptions);
  }

  // Execute the query
  const user = await query.exec();
  
  // Handle case where user isn't found
  if (!user) {
    throw createError(404, "User not found!");
  }

  // Return user
  return user;
}

/**
 * Given a user document, this function handles the entire deletion process. Deleting the user document
 * itself from the database, and also any related information stored about the user such as a possible 
 * avatar being stored server-side, or any Posts associated with the user.
 * 
 * @param user - The hydrated mongoose document that represents the user we are deleting
 * 
 * NOTE: This is more so a helper function. It'll be used in 'deleteAccount' which is the 
 * service for handling when a user decides to delete their own account. However it'll also be 
 * used in the 'removeEmployee' service function, when we are deleting an account that is 
 * an employee
 */
const deleteUser = async (user: IUserDoc) => {  
  // If the user has an avatar registered, delete it from our disk
  if (user.avatar) {
    await deleteFromCloudinary(user.avatar);
  }

  /*
  - We want to make sure that for a given operation both the user and the posts
    associated with the user are deleted. As a result, we'll use a transaction!
    In mongoose we do this with sessions.
  */
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    /*
    - If the user being deleted is an editor or administrator, then remove any potential
      posts that are associated with their accounts!
    */
    if (user.role === roles_map.editor || user.role === roles_map.admin) {
      await Post.deleteMany({user: user._id})
    }

    // Delete the user themselves and return the deleted user
    const deletedUser = await User.findByIdAndDelete(user._id);
    
    // Return the results of the deletion
    return deletedUser;

  } catch (err) {
    await session.abortTransaction() // cancel the transaction since something failed
    throw err; // re-throw the error so it's caught by the controller
  } finally {
    // Regardless of success or failure, end the session
    await session.endSession();
  }
}


/**
 * Delete a user from the database.
 * 
 * @param id - Id of the user we're deleting
 * @param password - Password of the user's account that we're deleting. The idea
 * is that users must provide the correct password of their account in order to delete 
 * it.
 */
const deleteAccount = async (id: string, password: string) => {
   // Attempt to find user via their ID
  const user = await findUserByID(id);

  /*
  - If user being deleted is an admin, then an admin is trying to delete their own account.
    As a result, deny the account deletion request.
    
  - NOTE: As per business rules, admins shouldn't be allowed to delete their own accounts. This is because admin accounts are 
    important, and also this prevents the idea of users accidentally deleting all admin accounts, and having to reinject new accounts 
    programmatically. So for an admin to have their account deleted, you'd need another administrator to do the account deletion, 
    via the 'removeEmployee' route. As a result, there should always be at least one admin account in our database
  */
  if (user.role === roles_map.admin) {
    throw createError(403, "Admins cannot delete their own accounts. If necessary, notify another admin user to delete this account for you!");
  }

  // check if the password matches
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) { 
    throw createError(400, "Password is incorrect!");
  }  

  // Attempt to delete user, if something goes wrong, an error will be thrown, and 
  // stopping this function's execution and propagating the error
  await deleteUser(user);


  // At this point deletion was successful, so return the user that was deleted
  return user;
}


/**
 * Update a user's avatar
 * 
 * @param id - Id of the user that we're updating
 * @param avatarFileName - The name of the image file that we saved for this user
 */
const updateAvatar = async(id: string, avatarUrl: string) => {

  const user = await findUserByID(id);

  // If user has an old avatar, delete it
  if (user.avatar) {      
    await deleteFromCloudinary(user.avatar);
  }

  user.avatar = avatarUrl;
  await user.save();
  return user;
}

/**
 * Delete a user's avatar via their id
 * 
 * @param id - id of the user whose avatar we are deleting
 */
const deleteAvatar = async(id: string) => {

  // Attempt to find user, if the user has an avatar recorded, then delete it
  const user = await findUserByID(id);
  if (user.avatar) {

    // Attempt to delete image file from cloudinary
    await deleteFromCloudinary(user.avatar);
    
    // Delete avatar file name stored in the database, and save changes
    user.avatar = "";
    await user.save();
  }

  // Regardless return the user; we want to return the user as json later in the request-response cycle
  return user;
}

/**
 * Update username of a user
 * 
 * @param id - Id of the user being updated
 * @param username - The new username that they want to change to; assumed to be lowercased already
 */
const updateUsername = async (id: string, username: string) => {
  // Attempt to find user from database
  const user = await findUserByID(id);

  // If username is new, attempt to update it
  if (user.username !== username) {
    await user.updateUsername(username);
    // At this point, username change was successful on the user instance, so save the changes to the database
    await user.save();
  }

  // Return the user
  return user; 
}

/**
 * Handles creating a email verification link and then the email to the user.
 * 
 * @param id - Id of the user being updated
 * @param email - New email that the user wants to change to
 * @param password - The inputted password for the current password of the user. Users need to provide their current password to 
 *                   be able to request to updaet their email
 */
const requestUpdateEmail = async (id: string, email: string, password: string) => {
  
  // Attempt to find the user by Id
  const user = await findUserByID(id);

  // Check whether the user's password is correct; if not then they can't verify their email
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw createError(400, "Password is incorrect");
  }

  // If current and new emails match, throw an error and stop function
  if (user.email === email) {
    throw createError(400, "Current and new email aren't different! Please choose a different email to update to!");
  }

  // A new email so check it's uniqueness
  const existingUser = await User.findOne({email: email});
  if (existingUser) {
    throw createError(400, `New email '${email}' is already associated with another account!`);
  }

  // The email isn't taken, so send a link to the new email for the user to verify it
  await user.sendEmailVerification(email);

  // Return the user
  return user;
}


/**
 * Sends an email verification link to the user's current email, if their current email
 * is not verified.
 * 
 * @param id - Id of the user whose's email we want to verify
 * 
 * NOTE: User's current email is not verified when the email they signed up 
 * with is still unverified. This is because if the user updated their email, they 
 * would have had to verify it before the update could take place.
 */
const requestVerifyCurrentEmail = async (id: string) => {
  // Attempt to find the user by ID
  const user = await findUserByID(id);

  // If they're already verified, the user's current email is already verified, so no need to continue
  if (user.isVerified) {
    throw createError(400, `Email associated with account is already verified!`);
  }

  // User's current email isn't verified, so send a verification link to that email
  await user.sendEmailVerification(user.email);

  // Return the user
  return user;
}



/**
 * Update the full name of the user
 * 
 * @param id - Id of the user that's being updated
 * @param fullName - The new fullName that the user wants to change to
 * @returns 
 */
const updateFullName = async (id: string, fullName: string) => {
  const user = await findUserByID(id);

  /*
  - if the fullName the user inputted is the same as the one they currently have,
    then return the function early with the user . As a result it's more user friendly
    as the client knows their request was updated, even if no actual update was needed.

    As well as this, it prevents us from doing unnecessary database operations by saving
    a new fullName.
  */
  if (user.fullName === fullName) {
    return user;
  }

  user.fullName = fullName;
  await user.save();
  return user;
}

/**
 * Update the password of a user
 * 
 * @param id - Id of the user whose password is being updated
 * @param password - The current password of the user
 * @param newPassword - The new password the user wants to change to
 * 
 */
const updatePassword = async (id: string, password: string, newPassword: string) => {
  /*
  - Checks if the new password is the same as the current password and throws an error if they match.
    This avoids unnecessary database operations for updating the password.
  */
  if (password === newPassword) {
    throw createError(400, "New password cannot be the same as the current password!");
  }

  const user = await findUserByID(id);

  // If user isn't verified, stop password update
  if (!user.isVerified) {
    throw createError(400, "The ability to update your password is disabled until you verify your email.");
  }

  // Check if the password the user entered matches their curernt password
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw createError(400, "Password is incorrect!");
  }

  // Update the password and return the user
  // Hash the password in this way
  user.password = await generatePasswordHash(newPassword);
  await user.save();

  return user;
}

const userServices = {
  findUserByID,
  deleteUser,
  deleteAccount,
  updateAvatar,
  deleteAvatar,
  updateUsername,
  requestUpdateEmail,
  requestVerifyCurrentEmail,
  updateFullName,
  updatePassword
}
export default userServices;