const router = require("express").Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.getTags);
router.post("/", tagController.createTag);

router.get("/:id", tagController.getTagDetails);
router.delete("/:id", tagController.deleteTag);
router.patch("/:id", tagController.updateTag);

module.exports = router;