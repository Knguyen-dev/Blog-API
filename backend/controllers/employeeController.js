const roles_map = require("../config/roles_map");
const userValidators = require("../middleware/validators/userValidators");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {body}  = require("express-validator");
const handleValidationErrors = require("../middleware/handleValidationErrors");



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
 */
const updateEmployee = [
  userValidators.username,
  userValidators.email,
  userValidators.fullName,
  userValidators.role,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    /*
    + Admins should be the only ones using this route. As well, we don't allow 
      admins to change their roles. 

    1. If the IDs match, the administrator is trying to modify themselves. So
      if this is true, and the role they passed into the body isn't for an 
      admin then send back an error saying that admins can't change their roles.
    */
    if (req.user.id === req.params.id && req.body.role !== roles_map.admin) {
      const err = new Error("Admins must stay as admins!");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findUserByID(req.params.id);
    if (!user.isEmployee) {
      const err = new Error("User being updated isn't an employee!");
      err.statusCode = 400;
      throw err;
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
  asyncHandler(async(req, res) => {
  
  // Try to find user with the passed in username
  const user = await User.findOne({username: req.body.username});
  if (!user) {
    const err = new Error( `User with username '${req.body.username}' not found!`);
    err.statusCode = 400; // We use 400 to indicate invalid input here.
    throw err;
  }

  // If they are already an employee, return an error message saying so.
  if (user.isEmployee) {
    const err = new Error("User is already an employee!");
    err.statusCode = 400;
    throw err;
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
const removeEmployee = asyncHandler(async(req, res) => {

  // If the requestor is trying to mark themselves as not an employee
  if (req.user.id === req.params.id) {
    const err = new Error("Admins can't remove themselves as employees!");
    err.statusCode = 400;
    throw err;
  }

  // Attempt to find user by its ID
  const user = await User.findUserByID(req.params.id);

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
