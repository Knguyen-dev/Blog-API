
/**
 * Yeah this part 
 */


import userValidators from "../middleware/validators/userValidators";
import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/errorUtils";
import employeeServices from "../services/employee.services";
import { Request, Response, NextFunction } from "express";
import employeeCache from "../services/caches/EmployeeCache";


/**
 * Gets all users that are employees.
 * 
 */
const getEmployees = asyncHandler(async(req: Request, res: Response) => {
  let employees = await employeeCache.getCachedEmployees();
  if (!employees) {
    employees = await employeeServices.getAllEmployees();
    await employeeCache.setCachedEmployees(employees);
  }
  res.status(200).json(employees);
})


/**
 * Updates an employee; specifically used for update operation on the data-grid
 */
const updateEmployee = [
  userValidators.username,
  userValidators.fullName,
  userValidators.role,
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    
    // Update an employee; req.user will be defined due to verifyJWT middleware
    const user = await employeeServices.updateEmployee(req.params.id, req.user!.id, req.body.username, req.body.fullName, req.body.role);

    await employeeCache.deleteCachedEmployees();

    res.status(200).json(user);
  })
]


/**
 * Adds/marks an existing account as an employee user.
 * 
 */
const addEmployee = [
  body("username").isLength({min: 1}).withMessage("Please enter the username of the user!"),
  userValidators.role,
  handleValidationErrors,
  asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  
  // Try to find user with the passed in username
  const user = await employeeServices.addEmployee(req.body.username, req.body.role);

  await employeeCache.deleteCachedEmployees();

  // Return updated user
  res.status(200).json(user);
})]

/**
 * Marks an existing account as not an employee. 
 */
const removeEmployee = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

  // Remove an employee; req.user will be defined due to verifyJWT middleware
  const result = await employeeServices.removeEmployee(req.params.id, req.user!.id);

  await employeeCache.deleteCachedEmployees();

  // Return the results of removing said employee
  res.status(200).json(result);
});

export {
  getEmployees,
  updateEmployee,
  addEmployee,
  removeEmployee
}
