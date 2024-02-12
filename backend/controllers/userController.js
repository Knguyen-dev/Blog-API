const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {validationResult} = require("express-validator");
const userValidator = require("../middleware/userValidators");
const bcrypt = require('bcrypt');


// + Get user via their user ID
const getUserById = asyncHandler(async (req, res, next) => {
  /*
  - Send back the user but exclude sensitive information. I mean we
    would send the info from server to client. Imagine if a 
    regular user was making this request, we will only send back relevant
    and non-sensitive info. Basically info that we would potentially want to show
    maybe on a user's account page. So here we're not sending back the password
    hash since that is sensitive info, and we're not sending back the index because
    honestly that doesn't really matter. 
  */
  const user = await User.findUserByID(req.params.userID, "-password -__v");

  res.status(200).json(user);
})

// + Delete a user via their ID
const deleteUserById = asyncHandler(async (req, res) => {
  // Attempt to find user by ID
  const user = await User.findUserByID(req.params.userID);

  // At this point a user was found so delete them
  await User.findByIdAndDelete(rew.params.userID);

  // Indicate that user was successfully deleted
  res.status(200).json({message: "User successfully deleted!"});
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
			const err = Error(errors.fullName);
      err.statusCode = 400;
      return next(err);
		}

    // Try to find a user with that ID
    const user = await User.findUserByID(req.params.userID);

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
    - If there were errors with the username, send it down our error handling pipeline.
    This makes it match the errors thrown in User.changeUsername. Now on the front-end
    know our errors are always in form {message: some_error_message }. 

    - NOTE: Remember that userValidator.username also performs a database check, 
      verifying whether the username has already been taken or not.
    */
    if (Object.keys(errors).length != 0) {
      const err = Error(errors.username);
      err.statusCode = 400;
      return next(err);
		}
    
    // Attempt to find our target user; covers whether they don't exist or id isn't valid.
    const user = await User.findUserByID(req.params.userID);

    // At this point user exists and username is valid, so save changes
    user.username = req.body.username;
    await user.save();

    // Username successfully changed, so respond indicating a success
    res.status(200).json({message: "User's username successfully updated!"});
})]







module.exports = {
  getUserById, 
  updateFullName,
  updateUsername,
  deleteUserById
}