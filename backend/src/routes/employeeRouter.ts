/*
+ Employee Router: The employee router and controller are special as they 
  both refer to and modify "User" documents, or documents in the 'users'
  collection. 
*/

import { Router } from "express";
import {
  getEmployees,
  updateEmployee,
  addEmployee,
  removeEmployee
} from "../controllers/employeeController";
import { verifyAdmin } from "../middleware/roleVerification";
import { verifyJWT } from "../middleware/tokenUtils";

const router = Router();

// All subsequent routes require authentication to use
router.use(verifyJWT);

// Middleware to ensure requests made to these endpoints are made by admins
router.use(verifyAdmin);

// Getting all users that are marked as employees
router.get("/", getEmployees);

// Adding a user as an employee (via username)
router.patch("/add", addEmployee);

// Removing a user as an employee (via id)
router.patch("/remove/:id", removeEmployee);

// Route for updating an employee, for admins.
router.patch("/:id", updateEmployee);

export default router;