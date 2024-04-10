const roles_map = require("../config/roles_map");
const userValidators = require("../middleware/validators/userValidators");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {body}  = require("express-validator");

const {createError, handleValidationErrors } = require("../middleware/errorUtils");
const {findDocByID} = require("../middleware/dbUtils");

/**
 * Gets all users that are employees.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getEmployees = asyncHandler(async(req, res) => {
  const users = await User.find({isEmployee: true});
  res.status(200).json(users);
})


/**
 * Updates an employee; specifically used for update operation on the data-grid
 *  
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * @param (function) next - next function
 */
const updateEmployee = [
  userValidators.username,
  userValidators.email,
  userValidators.fullName,
  userValidators.role,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    /*
    + Admins should be the only ones using this route. As well, we don't allow 
      admins to change their roles. 

    1. If the IDs match, the administrator is trying to modify themselves. So
      if this is true, and the role they passed into the body isn't for an 
      admin then send back an error saying that admins can't change their roles.
    */
    if (req.user.id === req.params.id && req.body.role !== roles_map.admin) {
      const err = createError(400, "Admins must stay as admins!");
      return next(err);
    }

    // Check if user exists
    const user = await findDocByID(User, req.params.id);
    if (!user) {
      const err = createError(404, "User not found!");
      return next(err);
    }

    // Check if user is an employee
    if (!user.isEmployee) {
      const err = createError(400, "User being updated isn't an employee!");
      return next(err);
    }
    
    await user.updateUsername(req.body.username);  
    user.email = req.body.email;
    user.fullName = req.body.fullName;
    user.role = req.body.role;
    await user.save();
    res.status(200).json(user);
    
  })
]


/**
 * Adds/marks an existing account as an employee user.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const addEmployee = [
  body("username").isLength({min: 1}).withMessage("Please enter the username of the user!"),
  userValidators.role,
  handleValidationErrors,
  asyncHandler(async(req, res, next) => {
  
  // Try to find user with the passed in username
  const user = await User.findOne({username: req.body.username});
  if (!user) {
    const err = createError(400, `User with username '${req.body.username}' not found!`)
    return next(err);
  }

  // If they are already an employee, return an error message saying so.
  if (user.isEmployee) {
    const err = createError(400, "User is already an employee!");
    return next(err);
  }

  // Update user's employee status and their role
  user.isEmployee = true;
  user.role = req.body.role;
  await user.save();

  // Return updated user
  res.status(200).json(user);
})]

/**
 * Marks an existing account as not an employee. 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const removeEmployee = asyncHandler(async(req, res, next) => {

  // If the requestor is trying to mark themselves as not an employee
  if (req.user.id === req.params.id) {
    const err = createError(400, "Admins can't remove themselves as employees!");
    return next(err);
  }

  // Attempt to find user by its ID
  const user = await findDocByID(User, req.params.id);
  if (!user) {
    const err = createError(404, "User not found!");
    return next(err);
  }

  /*
  - User has been found, indicate they aren't an employee 
   Then reduce their role to user.
  */
  user.isEmployee = false;
  user.role = roles_map.user;
  
  await user.save();

  // Return the user that was removed as an employee
  res.status(200).json(user);
});

module.exports = {
  getEmployees,
  updateEmployee,
  addEmployee,
  removeEmployee
}
