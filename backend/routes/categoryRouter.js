const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

// Get all categories
router.get("/", categoryController.getCategories);

// Create create category
router.post("/", categoryController.createCategory);

// Get, delete, and updating categories via id
router.get("/:id", categoryController.getCategoryDetails);
router.delete("/:id", categoryController.deleteCategory);
router.patch("/:id", categoryController.updateCategory);

module.exports = router;
