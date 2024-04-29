const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const {verifyEditorOrAdmin, verifyAdmin} = require("../middleware/roleVerification");
const {verifyJWT} = require("../middleware/tokenUtils");


// Get all categories; should be public
router.get("/", categoryController.getCategories);

// Gets category and published posts associated with it
router.get("/:id/posts/published", categoryController.getCategoryAndPublishedPosts);

// Subsequent routes require authentication
router.use(verifyJWT);

// Create create category
router.post("/", verifyEditorOrAdmin, categoryController.createCategory);

// Get, delete, and updating categories via id
router.get("/:id/posts", verifyAdmin, categoryController.getCategoryAndPosts);
router.delete("/:id", verifyEditorOrAdmin, categoryController.deleteCategory);
router.patch("/:id", verifyEditorOrAdmin, categoryController.updateCategory);

module.exports = router;
