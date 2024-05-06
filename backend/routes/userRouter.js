const router = require("express").Router();
const {verifyJWT} = require("../middleware/tokenUtils");
const roleVerification = require("../middleware/roleVerification");
const userController = require("../controllers/userController");
const postController = require("../controllers/PostController");
const userPerms = require("../middleware/permissions/userPerms");
const userLimiter = require("../middleware/limiters/userLimiter");
const {canGetUserPosts} = require("../middleware/permissions/postPerms");


// Routes only accessible for authenticated users
router.use(verifyJWT);

// Get all users; for admins only
router.get("/", roleVerification.verifyAdmin, userController.getUsers);

// Get user by id
router.get("/:id", userController.getUserById)


/*
- Get all the posts created by a user; Let this only be for administrators because we don't want unauthorized
users such as role="user" or "editor" to be able to see all of a user's post, even the unpublished ones.

- NOTE: In the future, you may add a way to get all published posts by a specific user using 
  a route "/:id/posts/published"
*/
router.get("/:id/posts", canGetUserPosts, postController.getPostsByUser);

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