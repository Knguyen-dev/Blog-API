const router = require("express").Router();
const tagController = require("../controllers/tagController");
const {verifyEditorOrAdmin} = require('../middleware/roleVerification');

// Get all tags
router.get("/", tagController.getTags);

// Create new tag
router.post("/", verifyEditorOrAdmin, tagController.createTag);

// Get, delete, and update tag via id
router.get("/:id", tagController.getTagDetails);

router.delete("/:id", 
  verifyEditorOrAdmin,
  tagController.deleteTag
);

router.patch("/:id", 
  verifyEditorOrAdmin,
  tagController.updateTag
);


module.exports = router;