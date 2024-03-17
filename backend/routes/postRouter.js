const router = require("express").Router();
const postController = require("../controllers/PostController");


router.get("/", postController.getPosts);
router.post("/", postController.createPost);

router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);
router.patch("/:id", postController.updatePost);


module.exports = router