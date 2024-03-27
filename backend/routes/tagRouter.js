const router = require("express").Router();
const tagController = require("../controllers/tagController");
const roleVerification = require('../middleware/roleVerification');



// Get all tags
router.get("/", tagController.getTags);

// Create new tag
router.post("/", roleVerification.verifyEditorOrAdmin, tagController.createTag);

// Get, delete, and update tag via id
router.get("/:id", tagController.getTagDetails);
router.delete("/:id", roleVerification.verifyEditorOrAdmin, tagController.deleteTag);
router.patch("/:id", roleVerification.verifyEditorOrAdmin, tagController.updateTag);

module.exports = router;