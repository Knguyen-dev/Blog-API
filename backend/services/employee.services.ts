import { createError } from "../middleware/errorUtils";
import { roles_map } from "../config/roles_map";
import User from "../models/User";
import userServices from "./user.services";

const getAllEmployees = async () => {
  const users = await User.find({isEmployee: true});
  return users;
}

/**
 * Updates a user that is an employee
 * 
 * @param id - Id of the user being updated
 * @param userId - Id of the user that's making this update request
 * @param username - New username
 * @param email - New email
 * @param fullName - new full name
 * @param role - new role
 */
const updateEmployee = async (id: string, userId: string, username: string, email: string, fullName: string, role: number) => {
   /*
    + Admins should be the only ones using this route. As well, we don't allow 
      admins to change their roles. 

    1. If the IDs match, the administrator is trying to modify themselves. So
      if this is true, and the role they passed into the body isn't for an 
      admin then send back an error saying that admins can't change their roles.
    */
    if (id === userId && role !== roles_map.admin) {
      throw createError(400, "Admins must stay as admins!"); 
    }

    // Attempt to find user via thier ID
    const user = await userServices.findUserByID(id);

    // Check if user is an employee
    if (!user.isEmployee) {
      throw createError(400, "User being updated isn't an employee!");
    }
    
    // Attempt to update the username attribute on our instance; not saved in db yet 
    await user.updateUsername(username);
    
    // Update other attributes
    user.email = email;
    user.fullName = fullName;
    user.role = role;    

    // Save all updates to the database and return the user
    await user.save();

    return user;
}

/**
 * Adds an employee as an employee, given their username
 * 
 * @param username - The username of the user being added as an employee
 * @param role - The role we're going to give the new employee
 */
const addEmployee = async (username: string, role: number) => {

  // Attempt to finduser via their username
  const user = await User.findOne({username});
  if (!user) {
    throw createError(400, "User already exists!");
  }

  // If they are already an employee, return an error message saying so.
  if (user.isEmployee) {
    throw createError(400, "User is already an employee!");    
  }

  // Update user's employee status and their role, then return the user
  user.isEmployee = true;
  user.role = role;
  await user.save();
  return user;
}

/**
 * 
 * @param id - Id of the user we are removing as an employee
 * @param userId - Id of the user making this request
 */
const removeEmployee = async (id: string, userId: string) => {
  // If the requestor is trying to mark themselves as not an employee
  if (id === userId) {
    throw createError(400, "Admins can't remove themselves as employees!");
  }

  // Attempt to find user by its ID
  const user = await userServices.findUserByID(id);
  
  /*
  - User has been found, indicate they aren't an employee 
  Then reduce their role to user.
  */
  user.isEmployee = false;
  user.role = roles_map.user;
  
  await user.save();

  return user;
}

const employeeServices = {
  getAllEmployees,
  updateEmployee,
  addEmployee,
  removeEmployee
}

export default employeeServices;