/*
+ The services function (backend):
These should focus on 'business' logic, or logic and information that closely relates 
to your business and is human-readable, usable, and you shouldn't need to know the underlying
logic or innerworkings of how a service/function works in order to use it. It should have a good 
level of abstraction. For example, a service could be a 'loginUser(username, password)'.
This function is very human-readable, you know what it does, and it relates to the business
logic of your code, it logs in a user to your application. In contrast something like get.
*/


import path from "path"
import User from "../models/User"
import Post from "../models/Post"
import mongoose from "mongoose"
import { createError } from "../middleware/errorUtils"
import { isValidObjectId } from "mongoose"
import { generatePasswordHash, verifyPassword } from "../middleware/passwordUtils"
import { deleteFromDisk, imageDirectory } from "../middleware/fileUpload";
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
    const avatarPath = path.join(imageDirectory, user.avatar);
    await deleteFromDisk(avatarPath);
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

    // Delete the user themselves; 
    const result = await User.deleteOne({_id: user._id});

    // Return the results of the deletion
    return result;

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

  const result = await deleteUser(user);
  return result;
}


/**
 * Update a user's avatar
 * 
 * @param id - Id of the user that we're updating
 * @param avatarFileName - The name of the image file that we saved for this user
 */
const updateAvatar = async(id: string, avatarFileName: string) => {

  const user = await findUserByID(id);

  // If user has an old avatar, delete it
  if (user.avatar) {      
      const oldAvatarPath = path.join(imageDirectory, user.avatar);
      try {
        await deleteFromDisk(oldAvatarPath);
      } catch (err) {
        // Small error could happen during development where we're deleting 
        // an avatar that doesn't exist in our own personal folder.
        console.log("Avatar deletion error: ", err)
      }
    }

    user.avatar = avatarFileName;
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
    const oldAvatarPath = path.join(imageDirectory, user.avatar);

    /*
    - Delete avatar file from the disk
    - If we failed to delete file because there wasn't a file like that in our directory,
      then we can easily just catch the error here. No need to stop the server, if there 
      was no file in our dir, just delete the avatar the user reported! 
    */
    try {
      await deleteFromDisk(oldAvatarPath);
    } catch (err) {
      console.log("Avatar deletion error: ", err);
    }
    
    // Delete avatar file name stored in the database
    user.avatar = "";
    await user.save();
    return user;
  }
}

/**
 * Update username of a user
 * 
 * @param id - Id of the user being updated
 * @param username - The new username that they want to change to.
 */
const updateUsername = async (id: string, username: string) => {
  // Find user from database
  const user = await findUserByID(id);

  // Call instance method which goes through the complex logic for updating username on the 
  // instance only, so it doesn't to the database.
  await user.updateUsername(username);

  // At this point, username change was successful on the user instance, so save the changes to the database
  await user.save();

  // Return the user
  return user; 
}

/**
 * Update the email of a user
 * 
 * @param id - Id of the user being updated
 * @param email - New email that the user wants to change to
 */
const updateEmail = async (id: string, email: string) => {
  const user = await findUserByID(id);

  // If emails are the same then it's not necessary to do db operation
  // stop execution early and return the user.
  if (user.email === email) {
    return user;
  }

  user.email = email;
  await user.save();
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

  // Attempt to find the user by their ID
  const user = await findUserByID(id);

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
  updateEmail,
  updateFullName,
  updatePassword
}
export default userServices;