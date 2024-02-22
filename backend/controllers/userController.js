const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {validationResult} = require("express-validator");
const userValidator = require("../middleware/userValidators");
const fileUpload = require("../middleware/fileUpload");
const path = require("path");


const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).json(users);
})


// + Get user via their user ID
const getUserById = asyncHandler(async (req, res) => {
  /*
  - Send back the user but exclude sensitive information. I mean we
    would send the info from server to client. Imagine if a 
    regular user was making this request, we will only send back relevant
    and non-sensitive info. Basically info that we would potentially want to show
    maybe on a user's account page. So here we're not sending back the password
    hash since that is sensitive info, and we're not sending back the index because
    honestly that doesn't really matter. 
  */
  const user = await User.findUserByID(req.params.id, "-password -__v");

  res.status(200).json(user);
})



// + Delete a user via their ID
const deleteUserById = asyncHandler(async (req, res) => {
  // Attempt to find user by ID
  const user = await User.findUserByID(req.params.id);

  // At this point a user was found so delete them
  await User.findByIdAndDelete(req.params.id);

  // Indicate that user was successfully deleted
  res.status(200).json({message: "User successfully deleted!"});
})






/*
- Logic for updating an avatar:

- NOTE: Updating only means adding or changing the avatar.
*/
const updateAvatar = [  
  // Attempt to save the image file for the avatar, if it exists
  fileUpload.uploadFile.single("file"),

  asyncHandler(async(req, res) => {
    // Attempt to find a user with the parameter id
    const user = await User.findUserByID(req.params.id);

    /*
    1. The user is changing avatars, so delete the old avatar 
      from our disk.
    - If there's an old avatar, then remove it. This is because the user 
      could be changing avatars, in that case we can think of it was replacing
      the old one with the new one. Or they are removing their avatar which 
      means we are just deleting the old one.
    */

    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, `../public/images/${user.avatar}`);
      await fileUpload.deleteFromDisk(oldAvatarPath);
    }

    // Save the saved file name to the user in the database
    // Then we'll be able to get this file later on the front end

    user.avatar = req.file.filename;
    await user.save();

    // Send the user back in json 
    return res.status(200).json({user}
    );
  })
]

const deleteAvatar = asyncHandler(async(req, res) => {
  const user = await User.findUserByID(req.params.id);
  // If the user has an existing avatar
  if (user.avatar) {
    // Delete avatar from disk
    const oldAvatarPath = path.join(__dirname, `../public/images/${user.avatar}`)
    await fileUpload.deleteFromDisk(oldAvatarPath);
    // Delete avatar from user in the database
    user.avatar = "";
    await user.save();
    res.status(200).json({user});
  } else {
    res.status(404).json({message: "No avatar available to delete!"});
  }
})







/*
+ Update full name: Update the full name of the user
*/
const updateFullName = [
  userValidator.fullName,

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
				[e.path]: e.msg,
			};
		}, {});
    
    /*
    - If there were any errors with fullName, pass it down the error handling
      pipeline we got. By doing this instead of res.status(400).json(...) we're 
      able to match the errors thrown in User.findUserByID. In the sense that 
      any error http response will have json in form {messsage: some_error_message}
      or however we've defined the json in our error handling in server.js
    
    - This makes it easy for our frontend to display an error message as we've
      guaranteed what form the error will be in.
    */
    if (Object.keys(errors).length != 0) {
      return res.status(400).json({message: errors.fullName})
		}

    // Try to find a user with that ID
    const user = await User.findUserByID(req.params.id);

    // At this point a user was found so update and save their info
    user.fullName = req.body.fullName;
    await user.save();

    res.status(200).json({message: "User successfully updated!"});
  })
]

// Update the username of a user
const updateUsername = [
  userValidator.username,
  asyncHandler(async (req,res,next) => {
    const errors = validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
				[e.path]: e.msg,
			};
		}, {});
    
    /*
    - If there were errors with the username, send back the reason why we found an error

    - NOTE: Remember that userValidator.username also performs a database check, 
      verifying whether the username has already been taken or not.
    */
    if (Object.keys(errors).length != 0) {
      return res.status(400).json({message: errors.username})
		}
    
    // Attempt to find our target user; covers whether they don't exist or id isn't valid.
    const user = await User.findUserByID(req.params.id);

    // At this point user exists and username is valid, so save changes
    user.username = req.body.username;
    await user.save();

    // Username successfully changed, so respond indicating a success
    res.status(200).json({message: "User's username successfully updated!"});
})]







module.exports = {
  getUsers,
  getUserById,
  updateAvatar,
  deleteAvatar,
  updateFullName,
  updateUsername,
  deleteUserById
}