const router = require("express").Router();
const tagController = require("../controllers/tagController");

// Get all tags
router.get("/", tagController.getTags);

// Create new tag
router.post("/", tagController.createTag);

// Get, delete, and update tag via id
router.get("/:id", tagController.getTagDetails);
router.delete("/:id", tagController.deleteTag);
router.patch("/:id", tagController.updateTag);

module.exports = router;