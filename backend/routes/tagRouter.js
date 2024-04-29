const router = require("express").Router();
const tagController = require("../controllers/tagController");
const {verifyEditorOrAdmin} = require('../middleware/roleVerification');
const {verifyJWT} = require("../middleware/tokenUtils");

// Get all tags; should be public
router.get("/", tagController.getTags);

// Get the tag and posts associated with it; public as well
router.get("/:id/posts/published", tagController.getTagAndPublishedPosts);




// Make sure users are logged in and they are editors or administrators
router.use(verifyJWT);
router.use(verifyEditorOrAdmin);

// Gets the tag and any posts associated with it
// Will likely make this isAdmin later.
router.get("/:id/posts", tagController.getTagAndPosts);


// Create new tag
router.post("/", tagController.createTag);

// Get, delete, and update tag via id
router.delete("/:id", 
  tagController.deleteTag
);

router.patch("/:id", 
  tagController.updateTag
);


module.exports = router;