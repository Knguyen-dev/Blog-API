const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const roles_list = require("../config/roles_list");
const userController = require("../controllers/userController");

// 
router.get("/", verifyRoles(roles_list.admin), userController.getUsers);

// Get a user by id; make it so we should be an administrator to do this
router.get("/:userID", userController.getUserById)

// Delete user by id: DELETE /users/:id
router.delete("/:userID", userController.deleteUserById);

// Update a user's fullName
router.patch("/:userID/fullName", userController.updateFullName);

// Update a user's username
router.patch("/:userID/username", userController.updateUsername);




module.exports = router;