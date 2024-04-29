const router = require("express").Router();
const postController = require("../controllers/PostController");
const roleVerification = require("../middleware/roleVerification");
const {verifyJWT} = require("../middleware/tokenUtils");

// Getting only published posts; should be public to everyone even unregistered users
router.get("/published", postController.getPublishedPosts);
router.get("/published/id/:id", postController.getPublishedPostByID);
router.get("/published/slug/:slug", postController.getPublishedPostBySlug);


// Other routes are for registered users; for editors and admins too I think
router.use(verifyJWT);

// Getting all posts; later we should just make it for administrators only
router.get("/", roleVerification.verifyAdmin, postController.getPosts);

// Creating a post; must be an editor or admin to do this
router.post("/", roleVerification.verifyEditorOrAdmin, postController.createPost);

// Getting a specific post's details; allows admins to view anyone's posts
router.get("/:id", roleVerification.verifyAdmin, postController.getPostByID);

// Deleting a post (editors can delete their own whilst admins can delete anyone's)
router.delete("/:id", roleVerification.verifyEditorOrAdmin, postController.deletePost);

// Updating the status of a post only (for admins only)
router.patch("/:id/status", roleVerification.verifyAdmin, postController.updatePostStatus);

// Updating a post in its entirety (users can only update their own posts)
router.patch("/:id", roleVerification.verifyEditorOrAdmin, postController.updatePost);


module.exports = router