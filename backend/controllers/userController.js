const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const userValidators = require("../middleware/validators/userValidators");
const fileUpload = require("../middleware/fileUpload");
const path = require("path");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const handleValidationErrors = require("../middleware/handleValidationErrors");

/**
 * Gets all users in the database
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
})

/**
 * Get a user via their ID
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findUserByID(req.params.id);
  res.status(200).json(user);
})

/**
 * Delete an existing user.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const deleteUser = [
  body("password").isLength({min: 1}).withMessage("Please enter your current password!"),
  userValidators.confirmPassword,
  handleValidationErrors,

  asyncHandler(async (req, res) => {
    // Attempt to find user by ID
    const user = await User.findUserByID(req.params.id);

    // check if password matches
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      
      const err = new Error("Passowrd is incorrect!");
      err.statusCode = 400;
      throw err;
    }

    /*
    - Everything is good, so start the deletion process.
    1. If the user has an avatar, delete it, so remove it from disk
    2. Delete the user from the database. We can use their id.
    */
    if (user.avatar) {
      const avatarPath = path.join(__dirname, `../public/images/${user.avatar}`);
      await fileUpload.deleteFromDisk(avatarPath);
    }

    // Delete user 
    await User.findByIdAndDelete(req.params.id);

    // Return the user that was deleted
    res.status(200).json(user);
  })
]

/**
 * Middleware for updating/changing an avatar.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const updateAvatar = [  
  // Attempt to save the image file for the avatar, if it exists
  fileUpload.uploadFile.single("file"),
  asyncHandler(async(req, res) => {

    // If no file, then stop function execution early
    if (!req.file) {
      const err = new Error("File was not detected on our end!")
      err.statusCode = 400;
      throw err;
    }

    // Attempt to find a user with the parameter id
    const user = await User.findUserByID(req.params.id);

    /*
    - The user is changing avatars, so delete the old avatar 
      from our disk.
    - If there's an old avatar, then remove it. This is because the user 
      could be changing avatars, in that case we can think of it was replacing
      the old one with the new one. Or they are removing their avatar which 
      means we are just deleting the old one.
    */

    if (user.avatar) {      
      const oldAvatarPath = path.join(fileUpload.imageDirectory, user.avatar);
      try {
        await fileUpload.deleteFromDisk(oldAvatarPath);
      } catch (err) {
        console.log("Avatar deletion error: ", err.messsage)
      }
      
    }

    // Save the saved file name to the user in the database
    // Then we'll be able to get this file later on the front end

    user.avatar = req.file.filename;
    await user.save();

    // Send the user back in json 
    return res.status(200).json(user);
  })
]

/**
 * Middleware for deleting a user's avatar.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: Even if the user doesn't have an avatar, and they're trying to delete, we'll
 * still send back a status 200
 */
const deleteAvatar = asyncHandler(async(req, res) => {
  const user = await User.findUserByID(req.params.id);
  // If the user has an existing avatar
  if (user.avatar) {
    // Delete avatar from disk

    const oldAvatarPath = path.join(fileUpload.imageDirectory, user.avatar);

    /*
    - If we failed to delete file because there wasn't a file like that in our directory,
      then we can easily just catch the error here. No need to stop the server, if there 
      was no file in our dir, just delete the avatar the user reported! 
    */
    try {
      await fileUpload.deleteFromDisk(oldAvatarPath);
    } catch (err) {
      console.log("Avatar deletion error: ", err.message);
    }
    
    // Delete avatar from user in the database
    user.avatar = "";
    await user.save();
  }

  res.status(200).json(user);
});

/**
 * Middleware for updating a user's username
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const updateUsername = [
  userValidators.username,
  handleValidationErrors,
  asyncHandler(async(req, res) => {
    
    // Username syntax is valid, try to find user with target ID
    const user = await User.findUserByID(req.params.id);
    
    // Try to update username and return updated user as json
    await user.updateUsername(req.body.username);

    res.status(200).json(user);
  })
]

/**
 * Middleware for updating a user's email
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const updateEmail = [
  userValidators.email,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
   
    // Attempt to find user
    const user = await User.findUserByID(req.params.id); 

    // User has been found so just update the email
    user.email = req.body.email;
    await user.save();

    // Return the updated user after success
    return res.status(200).json(user);
  })
]

/**
 * Middleware for updating the full name of a user
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const updateFullName = [
  userValidators.fullName,
  handleValidationErrors,

  asyncHandler(async(req, res) => {

    // Find user
    const user = await User.findUserByID(req.params.id);

    // Apply changes since the user exists!
    user.fullName = req.body.fullName;
    await user.save();

    // Return updated user as json
    return res.status(200).json(user);
  })
]

/**
 * Middleware updating/changing the password of a user.
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const changePassword = [
  body("oldPassword").isLength({min: 1}).withMessage("Please enter in your old password!"),
  userValidators.password, // new password must be validated using our standards.
  userValidators.confirmPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {

    // Attempt to find user via their ID
    const user = await User.findUserByID(req.params.id);

    // Check if the old password they entered matches the password on the account
    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) {
      const err = new Error("Old Password you entered was incorrect!");
      err.statusCode = 400;
      throw err;
    }

    // Everything passes so hash and save the user's new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.password = hashedPassword;
    await user.save();

    /*
    1. A password change should log out the user, so log out the user on the 
      backend by removing their refresh token 'cookie. So on the front-end 
      handle the logic for sending a request to our login endpoint, and 
      the general log out logic for the front-end
    2. Indicate that password change was successful.
    */
    res.status(200).json({message: "Password change successful!"});
  })
];

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
  updateAvatar,
  deleteAvatar,
  updateUsername,
  updateEmail,
  updateFullName,
  changePassword,
}
