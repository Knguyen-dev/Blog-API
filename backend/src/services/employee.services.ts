import { createError } from "../middleware/errorUtils";
import { roles_map } from "../config/roles_map";
import { getRoleString } from "../middleware/roleUtils";
import User from "../models/User";
import userServices from "./user.services";

const getAllEmployees = async () => {

  // Find all users, 
  const users = await User.find({
    $or: [
      // With an OR statement, put the most likely option first, so a given user 
      // is more likely to be an editor than admin
      { role: roles_map.editor }, 
      { role: roles_map.admin }
    ]
  });

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
const updateEmployee = async (id: string, userId: string, username: string, fullName: string, role: number) => {
   /*
    + Admins should be the only ones interacting with this service function. As well, we don't allow 
      admins to change their own roles. 

    1. If the IDs match, the administrator is trying to modify themselves. So
      if this is true, and the role they passed into the body isn't for an 
      admin then send back an error saying that admins can't change their roles.
    */
    if (id === userId && role !== roles_map.admin) {
      throw createError(400, "As an admin, you can't change your own role!"); 
    }

    /*
    - If role is user, then we are trying to change an existing employee's  role back to 'user'. In this case,
      stop the operation and return back an error, as an employee (can't have their role changed back to user.
    - NOTE: Employee is a user who already have the role 'editor' or 'admin'
    */
    if (role === roles_map.user) {
      throw createError(400, "Employees (editors and admins), can't have their role changed back to role 'user'!");
    }

    // Attempt to find user via their ID
    const user = await userServices.findUserByID(id);

    // If the user isn't an employee
    if (!user.isEmployee()) {
      throw createError(400, "User being updated isn't an employee since they have role 'user'!");
    }

    // Attempt to update the username attribute on our instance; not saved in db yet 
    await user.updateUsername(username);
    
    // Update other attributes
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

  if (role === roles_map.user) {
    throw createError(400, "To be an employee, the account's new role has to be 'editor' or 'admin'!");
  }

  // Attempt to finduser via their username
  const user = await User.findOne({username});
  if (!user) {
    throw createError(400, "User already exists!");
  }

  // If they are already an employee, return an error message saying so.
  if (user.isEmployee()) {
    throw createError(400, `User '${user.username}' is already an employee with role '${getRoleString(user.role)}' !`);    
  }

  user.role = role;
  await user.save();
  return user;
}

/**
 * Removes a user that's an employee
 * 
 * NOTE: Remember a user is considered an employee when they have the role of an 
 * editor or an admin!
 * 
 * Since we're deleting the employee, we need to worry about deleting avatars as well.
 * This is piling up. So the solution is to create a deleteUser function that 
 * accepts only the id of the user. Then we'd be able to use it 
 * 
 * @param id - Id of the user we are removing as an employee
 * @param userId - Id of the user making this request
 */
const removeEmployee = async (id: string, userId: string) => {
  
  // If the requestor (an admin), is trying to delete their own account
  if (id === userId) {
    throw createError(400, "Admins can't remove themselves as employees!");
  }

  // Attempt to find a user via their ID
  const user = await userServices.findUserByID(id);

  // If not an employee then we're not performing the deletion operation
  if (!user.isEmployee()) {
    throw createError(400, "User being deleted isn't an employee!");
  }

  const result = await userServices.deleteUser(user);
  return result;
}

const employeeServices = {
  getAllEmployees,
  updateEmployee,
  addEmployee,
  removeEmployee
}

export default employeeServices;