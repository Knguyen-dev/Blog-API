const router = require("express").Router();
const postController = require("../controllers/PostController");

// Getting all posts
router.get("/", postController.getPosts);

// Creating a post
router.post("/", postController.createPost);

// Get, delete, and update posts via id
router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);
router.patch("/:id", postController.updatePost);


module.exports = router