const router = require("express").Router();

const roleVerification = require("../middleware/roleVerification");
const userController = require("../controllers/userController");
const postController = require("../controllers/PostController");
const userPerms = require("../middleware/permissions/userPerms");
const userLimiter = require("../middleware/limiters/userLimiter");





// Get all users; for admins only
router.get("/", roleVerification.verifyAdmin, userController.getUsers);

// Get user by id
router.get("/:id", userController.getUserById)


// Get the posts created by a user
router.get("/:id/posts", postController.getPostsByUser);



// Limit amount of requests for editing a user account
router.use(userLimiter.editUserLimiter)


// Apply 'canModifyUser' middleware to all of the below routes
router.use("/:id", userPerms.canModifyUser);

// Route for deleting users; 
router.delete("/:id", userController.deleteUser);

// Routes for updating and editing users
router.patch("/:id/avatar", userController.updateAvatar);
router.delete("/:id/avatar", userController.deleteAvatar);
router.patch("/:id/username", userController.updateUsername);
router.patch("/:id/email", userController.updateEmail);
router.patch("/:id/fullName", userController.updateFullName);

// Update a password of a specific user
router.patch("/:id/password", userController.changePassword);



module.exports = router;