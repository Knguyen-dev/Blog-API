const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const employeeController = require("../controllers/employeeController");
const roles_list = require("../config/roles_list");
const employeeLimiter = require("../middleware/limiters/employeeLimiter");

// Route for signing up an employee; only for admins!
router.post("/signup", employeeLimiter.signupLimiter, verifyRoles(roles_list.admin), employeeController.signupEmployee);




module.exports = router;