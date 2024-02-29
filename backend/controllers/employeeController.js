const getErrorMap = require("../middleware/getErrorMap");
const userValidators = require("../middleware/userValidators");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");


/*
+ Controller for signing up employees:
- Despite the repetition, it makes sense that we'll
  have two route handlers for signing up regular users
  versus signing up editors or admins. Here, we'll need
  the user making the request to be an admin, and we'll do 
  that by ensuring that htey're authenticated and that the 
  role matches.

- NOTE: 
1. Should be only accessible to admin users only.
2. I should probably make a userValidator.role as well
*/

const signupEmployee = [
  userValidators.username,
  userValidators.email,
  userValidators.fullName,
  userValidators.password,
  userValidators.confirmPassword,
  userValidators.employeeRole,  
  asyncHandler(async (req, res) => {

    // Check for syntax errors, if so send back an error object as json
    // which will allow us to display errors messages specific to the input fields.
    const errors = getErrorMap(req);
    if (Object.keys(errors).length!= 0) {
      return res.status(400).json(errors);
    }
    const { username, email, fullName, password, role } = req.body;
    /*
    - Attempt to signup user. There's a chance this throws an error with 
      status code 400, 'username error'. If so to catch it here and modify 'errors' object so that it has the error message because 
      that status 400 represents a form error. Then we send back the stuff 
      as json. Else if it's not status 400, we throw the error so that it's 
      caught in async handler.

    */
    try {
      const user = await User.signup(
        email, 
        username,
        password,
        fullName,
        role
      );
      res.status(200).json(user);
    } catch (err) {
      if (err.statusCode === 400) {
        errors.username = err.message;
        res.status(400).json(errors);
      } else {
        throw err;
      }
    }    
  }
)]

module.exports = {
  signupEmployee
}
