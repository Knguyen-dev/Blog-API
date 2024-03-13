const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const userValidators = require("../middleware/userValidators");
const fileUpload = require("../middleware/fileUpload");
const path = require("path");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const getErrorMap = require("../middleware/getErrorMap");



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
  const user = await User.findUserByID(req.params.id);

  res.status(200).json(user);
})

/*
+ Delete a user: Handles deleting a user's account. For this to pass, the 
  user must enter their password and confirm their password.

1. Delete the user's avatar.
2. Delete the user from the database.

- NOTE: This function will probably get more changes as we 
  go on with making posts as well. For example, we'd have to delete all
  of the pictures associated with those posts that are on disk. Then 
  after we can delete the post documents from the database.

*/
const deleteUser = [
  body("password").isLength({min: 1}).withMessage("Please enter your current password!"),
  userValidators.confirmPassword,
  asyncHandler(async (req, res) => {
    const errors = getErrorMap(req);  
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json(errors);
    }

    // Attempt to find user by ID
    const user = await User.findUserByID(req.params.id);

    // Verify that the entered in password hashes to one in database
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      errors.password = "Current password is incorrect!";
      return res.status(400).json(errors);
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

    await User.findByIdAndDelete(req.params.id);

    // Indicate that user was successfully deleted
    res.status(200).json({message: "Account successfully deleted!"});
  })
]

/*
- Logic for updating an avatar:
- NOTE: Updating only means adding or changing the avatar.
*/
const updateAvatar = [  
  // Attempt to save the image file for the avatar, if it exists
  fileUpload.uploadFile.single("file"),
  asyncHandler(async(req, res) => {

    // If no file, then stop function execution early
    if (!req.file) {
      return res.status(400).json({ message: "File was not detected on our end!" });
    }

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
      
      const oldAvatarPath = path.join(fileUpload.imageDirectory, user.avatar);

      // const oldAvatarPath = `/${fileUpload.imageDirectory}/${user.avatar}`;
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
    return res.status(200).json({user}
    );
  })
]

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
    
    - NOTE: This is just defensive programming on my part. 
    */
    try {
      await fileUpload.deleteFromDisk(oldAvatarPath);
    } catch (err) {
      console.log("Avatar deletion error: ", err.message);
    }
    
    // Delete avatar from user in the database
    user.avatar = "";
    await user.save();
    res.status(200).json({user});
  } else {
    res.status(404).json({message: "No avatar available to delete!"});
  }
})

const updateUsername = [
  userValidators.username,
  asyncHandler(async(req, res) => {
    const errors = getErrorMap(req);
    
    // If it failed basic syntax checks, send back error message in json
    if (Object.keys(errors).length != 0) {
      return res.status(400).json({message: errors.username});
		}

    // Username syntax is valid, try to find user with target ID
    const user = await User.findUserByID(req.params.id);
    
    // Try/catch to catch our custom errors when updating the username
    try {
      // Try to update username and return updated user as json
      await user.updateUsername(req.body.username);
      return res.status(200).json(user);
    } catch (err) {

      // If status 400, then we caught an username related error when updating the username.
      if (err.statusCode === 400) {
        return res.status(400).json({message: err.message});
      } 

      // Else, it's not a username related error so throw it.
      throw err;
    }
  })
]

const updateEmail = [
  userValidators.email,
  asyncHandler(async (req, res) => {
    const errors = getErrorMap(req);

    // If email fails to pass basic syntax rules, send back error message in json
    if (Object.keys(errors).length != 0) {
      return res.status(400).json({message: errors.email});
		}
   
    // Attempt to find user
    const user = await User.findUserByID(req.params.id); 

    // If the emails of the found user is the same as the one sent in the request, return an error response
    if (user.email === req.body.email) {
      return res.status(400).json({message: `Updated email must be different from the current account's email!`});
    }

    // At this point, it's a new email, so apply and save changes to the user
    user.email = req.body.email;
    await user.save();

    // Return the updated user after success
    return res.status(200).json(user);
  })
]

const updateFullName = [
  userValidators.fullName,
  asyncHandler(async(req, res) => {
    const errors = getErrorMap(req);

    // If fullName fails to pass basic syntax rules, send back error message in json
    if (Object.keys(errors).length != 0) {
      return res.status(400).json({message: errors.fullName});
		}

    // Find user
    const user = await User.findUserByID(req.params.id);

    // If the emails of the found user is the same as the one sent in the request, return an error response
    if (user.fullName === req.body.fullName) {
      return res.status(400).json({message: `Updated name must be different from the current account's name!`});
    }

    // Apply changes and save user since it's a new name
    user.fullName = req.body.fullName;
    await user.save();

    // Return updated user as json
    return res.status(200).json(user);
  })
]

const changePassword = [
  /*
  - Validate old password, new password, and confirmed password 
    for basic syntax.
  */
  body("oldPassword").isLength({min: 1}).withMessage("Please enter in your old password!"),
  userValidators.password,
  userValidators.confirmPassword,

  asyncHandler(async (req, res) => {
    const errors = getErrorMap(req);

    // If password fields fail basic syntax checks, return error object
    if (Object.keys(errors).length != 0) {
      return res.status(400).json(errors);
		}

    const user = await User.findUserByID(req.params.id);

    // Check if the old password they entered matches the password on the account
    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) {
      errors.oldPassword = "Old password you entered was incorrect!"
      return res.status(400).json(errors);
    }

    // Everything passes so hash and save the user's new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.password = hashedPassword;
    await user.save();

    /*
    1. A password change should log out the user, so log out the user on the 
      backend by removing their refresh token 'cookie.
    2. Indicate that password change was successful.
    
    - NOTE: Then on the client side, the application would make a request 
      to the logout endpoint to log out the user, which will clear their 
      refresh token cookie. In a RESTful API, redirects aren't typically used
      in the same way that front end apps do it. Instead of redirects on the server-side,
      the client is responsible for making those individual requests in tandem.

      RESTful is stateless, as each request from the client must contain all info 
      necessary. The server doesn't need to store data, and each request is a complete/independent
      transaction. Basically one isolated request per interaction.
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
