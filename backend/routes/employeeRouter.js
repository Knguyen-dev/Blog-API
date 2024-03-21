/*
+ Employee Router: The employee router and controller are special as they 
  both refer to and modify "User" documents, or documents in the 'users'
  collection. 
*/
const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const employeeController = require("../controllers/employeeController");
const roles_map = require("../config/roles_map");


// Middleware to ensure requests made to these endpoints are made by admins
router.use(verifyRoles(roles_map.admin));

// Getting all users that are marked as employees
router.get("/", employeeController.getEmployees);

// Adding a user as an employee (via username)
router.patch("/add", employeeController.addEmployee);

// Removing a user as an employee (via id)
router.patch("/remove/:id", employeeController.removeEmployee);

// Route for updating an employee, for admins.
router.patch("/:id", employeeController.updateEmployee);

module.exports = router;