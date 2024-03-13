const router = require("express").Router();
const categoryController = require("../controllers/categoryController");


router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);


router.get("/:id", categoryController.getCategoryDetails);
router.delete("/:id", categoryController.deleteCategory);
router.patch("/:id", categoryController.updateCategory);

module.exports = router;
