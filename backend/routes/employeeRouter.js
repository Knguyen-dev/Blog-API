const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const employeeController = require("../controllers/employeeController");
const roles_list = require("../config/roles_list");


router.use(verifyRoles(roles_list.admin));

router.get("/", employeeController.getEmployees);

/*
- NOTE: '/add' adds the employee status to a user. Whilst 'remove/:id' 
  removes the employee status from the user. Because we are updating 
  the statuses and roles of users here we're using patch instead 
  of post and delete. If we were creating and deleting users 
  we would opt for POST and DELETE, but we aren't.
*/

router.patch("/add", employeeController.addEmployee);
router.patch("/remove/:id", employeeController.removeEmployee);



// Route for updating an employee, for admins.
router.patch("/:id", employeeController.updateEmployee);


module.exports = router;