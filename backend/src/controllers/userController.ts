import User from "../models/User";
import asyncHandler from "express-async-handler";
import userValidators from "../middleware/validators/userValidators";
import { saveFileToDisk} from "../middleware/fileUpload";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/errorUtils";
import userServices from "../services/user.services";
import employeeCache from "../services/caches/EmployeeCache";

/**
 * Gets all users in the database
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
})

/**
 * Get a user via their ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userServices.findUserByID(req.params.id);
  res.status(200).json(user);
})

/**
 * Delete an existing user.
 * 
 * NOTE: This is for users to delete their own account as they'll have to enter in their 
 * password to do this.
 */
const deleteUser = [
  body("password").isLength({min: 1}).withMessage("Please enter your current password!"),
  userValidators.confirmPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    
    // Attempt to delete the user via their id and using the inputted password
    const user = await userServices.deleteAccount(req.params.id, req.body.password);

    /*
    - If the user is an employee, we'll invalidate the employee cache. This prevents the 
      scenario where an admin receives cached data where the deleted employee still shows 
      up as an employee

    - NOTE: user will be defined at this point as the deleteAccount operation has worked. If any failed 
      in the delete account operation, an error would be thrown and this code won't be reached. We 

    + Deleting the employee cache:
    In our controllers deleteUser, updateAvatar, deleteAvatar, updateUsername, updateEmail,
    and updateFullName, if the user being updated is an employee, we want to delete the 
    employees cache. 

    We use the employee cache to display dashboard data for our administrators about our current
    employees, and so we want it to be as fresh information as possible. So when an employee's 
    information changes, we invalidate the current cache, forcing the request to get fresh data 
    from our database. So if employees have no changes to their avatar, username, email, name, role,
    or the time they last logged in, then we can continue to serve cached data, and our cache 
    is insync with the database; the ideal which is fresh cached data.

    One more thing to note is that if a service function fails it would throw an
    error which would be caught and sent to the error handling middleware. In essence
    in our controllers, if those functions succeed our 'user' is guaranteed to be defined.
    */
    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees();
    }

    // Return the deleted user
    res.status(200).json(user);
  })
]

/**
 * Middleware for updating/changing an avatar.
 * 
 */
const updateAvatar = [
  saveFileToDisk,
  asyncHandler(async(req, res) => {
    
     /*
    - If previous middleware finds that req.file doesn't exist, then it throws an error 
      and this middleware function doesn't run. However if saveFileToDisk runs successfully, 
      then this middleware will run, and req.file is guaranteed to exist.
    - Summary: req.file is guaranteed to exist due to previous middleware.
    */
    const fileName = req.file!.filename;

    // Attempt to update the avatar of the user; 
    const user = await userServices.updateAvatar(req.params.id, fileName);

    // If the user who updated their avatar was an employee
    // Invalidate the employee cache; 
    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees();
    }

    // Send the user back in json 
    res.status(200).json(user);
  })
]

/**
 * Middleware for deleting a user's avatar.
 * 
 * NOTE: Even if the user doesn't have an avatar, and they're trying to delete, we'll
 * still send back a status 200
 */
const deleteAvatar = asyncHandler(async(req, res) => {

  // Attempt to delete the avatar linked to id <req.params.id>
  const user = await userServices.deleteAvatar(req.params.id);

  // If an employeee was updated, invalidate the employees cache
  // NOTE: if deleteAvatar works, then 'user' is guaranteed to be defined
  if (user && user.isEmployee()) {
    await employeeCache.deleteCachedEmployees();
  }

  res.status(200).json(user);
});

/**
 * Middleware for updating a user's username
 * 
 */
const updateUsername = [
  userValidators.username,
  handleValidationErrors,
  asyncHandler(async(req, res) => {

    // Attempt to update the username; if successful, we get the updated user back
    const user = await userServices.updateUsername(req.params.id, req.body.username);

    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees();
    }

    res.status(200).json(user);
  })
]

/**
 * Middleware for updating a user's email
 * 
 */
const updateEmail = [
  userValidators.email,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
   
    // Attempt to update the username
    const user = await userServices.updateEmail(req.params.id, req.body.email);

    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees();
    }

    // Return the updated user after success
    res.status(200).json(user);
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

    // Attempt to update the user's full name, provide the user's id the full name value
    // they want to change to.
    const user = await userServices.updateFullName(req.params.id, req.body.fullName);

    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees();
    }

    // Return updated user as json
    res.status(200).json(user);
  })
]

/**
 * Middleware updating/changing the password of a user.
 */
const changePassword = [
  body("oldPassword").isLength({min: 1}).withMessage("Please enter in your old password!"),
  userValidators.password, // new password must be validated using our standards.
  userValidators.confirmPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {

    // Attempt to update the password of the user; 
    const user = await userServices.updatePassword(req.params.id, req.body.oldPassword, req.body.password);

    // Return the updated user; keeps consistency with other 
    // controller's behavior of returning updated user
    res.status(200).json(user);
  })
];

export {
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
