const router = require("express").Router();
const postController = require("../controllers/PostController");
const roleVerification = require("../middleware/roleVerification");

// Getting all posts
router.get("/", postController.getPosts);


// Creating a post; must be an editor or admin to do this
router.post("/", roleVerification.verifyEditorOrAdmin, postController.createPost);

// Get, delete, and update posts via id
router.get("/:id", postController.getPost);

/*
- Routes for deleting or updating a post; We'll verify that the user is 
  an editor or admin before proceeding with the request. Then we 
  will apply permissiosn middleware on the post


*/
router.delete("/:id", roleVerification.verifyEditorOrAdmin, postController.deletePost);
router.patch("/:id", roleVerification.verifyEditorOrAdmin, postController.updatePost);


module.exports = router