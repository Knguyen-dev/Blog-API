const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const roles_map = require("../config/roles_map");
const userController = require("../controllers/userController");
const userPerms = require("../middleware/permissions/userPerms");
const userLimiter = require("../middleware/limiters/userLimiter");

// Get all users; for admins only
router.get("/", verifyRoles(roles_map.admin), userController.getUsers);

// Get user by id
router.get("/:id", userController.getUserById)

// Limit amount of requests for editing a user account
router.use(userLimiter.editUserLimiter)

// Route for deleting users; apply canDeleteUser to that route only
router.delete("/:id", userPerms.canDeleteUser, userController.deleteUser);

// Routes for updating and editing users; apply canEditUser to all of the below routes
router.use("/:id", userPerms.canEditUser);
router.patch("/:id/avatar", userController.updateAvatar);
router.delete("/:id/avatar", userController.deleteAvatar);
router.patch("/:id/username", userController.updateUsername);
router.patch("/:id/email", userController.updateEmail);
router.patch("/:id/fullName", userController.updateFullName);

// Update a password of a specific user
router.patch("/:id/password", userController.changePassword);



module.exports = router;