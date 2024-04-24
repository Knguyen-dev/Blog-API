const router = require("express").Router();
const postController = require("../controllers/PostController");
const roleVerification = require("../middleware/roleVerification");

// Getting all posts
router.get("/", postController.getPosts);

// Creating a post; must be an editor or admin to do this
router.post("/", roleVerification.verifyEditorOrAdmin, postController.createPost);

// Getting a specific post's details
router.get("/:id", postController.getPostDetails);

// Deleting a post 
router.delete("/:id", roleVerification.verifyEditorOrAdmin, postController.deletePost);

// Updating the status of a post only (for admins only)
router.patch("/:id/status", roleVerification.verifyAdmin, postController.updatePostStatus);

// Updating a post in its entirety
router.patch("/:id", roleVerification.verifyEditorOrAdmin, postController.updatePost);


module.exports = router