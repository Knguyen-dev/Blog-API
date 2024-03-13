const roles_list = require("../config/roles_list");
const getErrorMap = require("../middleware/getErrorMap");
const userValidators = require("../middleware/userValidators");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");


/*
+ Controller for handling users that are specifically marked as 'employees':
- NOTE: 
1. Should be only accessible to admin users only.
*/


// Gets all users that are employees
const getEmployees = asyncHandler(async(req, res) => {

  const users = await User.find({isEmployee: true});
  if (users.length === 0) {
    return res.status(404).json({message: "No employees found!"});
  }

  res.status(200).json(users);
})

/*
-  Updates an employee, used for the update operation on the data grid.

- NOTE: On the data-grid we'd display a single error message on a toast. So
  as a result, this route handler will abide by that rule and when there are 
  errors, it will send back errors in form {message: "some error message"}
*/

const updateEmployee = [
  userValidators.username,
  userValidators.email,
  userValidators.fullName,
  userValidators.role,  

  asyncHandler(async (req, res) => {

    const errors = getErrorMap(req);

    // If there were syntax errors, return the first error value in the error object
    if (Object.keys(errors).length !== 0) {
      const firstKey = Object.keys(errors)[0];
      return res.status(400).json({message: errors[firstKey]});
    }

    /*
    + Admins should be the only ones using this route. As well, we don't allow 
      admins to change their roles. 

    1. If the IDs match, the administrator is trying to modify themselves. So
      if this is true, and the role they passed into the body isn't for an 
      admin then send back an error saying that admins can't change their roles.
    */
    if (req.user.id === req.params.id && req.body.role !== roles_list.admin) {
      return res.status(400).json({message: "Admins must stay as admins!"});
    }

    const user = await User.findUserByID(req.params.id);
    if (!user.isEmployee) {
      return res.status(400).json({message: "User being updated isn't an employee!"});
    }
    
    await user.updateUsername(req.body.username);  
    user.email = req.body.email;
    user.fullName = req.body.fullName;
    user.role = req.body.role;
    await user.save();
    res.status(200).json(user);
    
  })
]

/*
+ Adds/marks an existing account as an employee user. Must pass
  in the 'username' and 'role' to the 

- NOTE: These will be patch route handlers because we're not actually
  adding or removing users from the database but just updating their fields.
*/
const addEmployee = [
  userValidators.role,
  asyncHandler(async(req, res) => {

  // Ensure role entered is valid
  const errors = getErrorMap(req);
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({message: errors["role"]});
  }
  
  // Try to find user with the passed in username
  const user = await User.findOne({username: req.body.username});
  if (!user) {
    return res.status(404).json({message: "User not found!"});
  }

  // If they are already an employee, return an error message saying so.
  if (user.isEmployee) {
    return res.status(400).json({message: "User is already an employee!"});
  }

  // Update user's employee status and their role
  user.isEmployee = true;
  user.role = req.body.role;
  await user.save();

  // Return updated user
  res.status(200).json(user);
})]

/*
+ Marks an existing account as not an employee. The 
  id of the employee must be indicated.

*/
const removeEmployee = asyncHandler(async(req, res) => {


  // If the requestor is trying to mark themselves as not an employee
  if (req.user.id === req.params.id) {
    return res.status(400).json({message: "Admins can't remove themselves as employees!"})
  }

  // Attempt to find user by its ID
  const user = await User.findUserByID(req.params.id);

  /*
  - User has been found, indicate they aren't an employee 
   Then reduce their role to user.

  */
  user.isEmployee = false;
  user.role = roles_list.user;
  
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
