const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const roleVerification = require("../middleware/roleVerification");

// Get all categories
router.get("/", categoryController.getCategories);

// Create create category
router.post("/", roleVerification.verifyEditorOrAdmin, categoryController.createCategory);

// Get, delete, and updating categories via id
router.get("/:id", categoryController.getCategoryDetails);
router.delete("/:id", roleVerification.verifyEditorOrAdmin, categoryController.deleteCategory);
router.patch("/:id", roleVerification.verifyEditorOrAdmin, categoryController.updateCategory);

module.exports = router;
