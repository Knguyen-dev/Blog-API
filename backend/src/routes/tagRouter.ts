import { Router } from "express";
import {
  createTag,
  deleteTag,
  updateTag,
  getTags,
  getTagAndPosts,
  getTagAndPublishedPosts
} from "../controllers/tagController";
import { createTagLimiter, updateTagLimiter, deleteTagLimiter } from "../middleware/limiters/tagLimiter";
import {verifyEditorOrAdmin} from '../middleware/roleVerification';
import {verifyJWT} from "../middleware/tokenUtils";

const router = Router();

// Get all tags; should be public
router.get("/", getTags);

// Get the tag and posts associated with it; public as well
router.get("/:id/posts/published", getTagAndPublishedPosts);

// Make sure users are logged in and they are editors or administrators
router.use(verifyJWT);
router.use(verifyEditorOrAdmin);

// Gets the tag and any posts associated with it
// Will likely make this isAdmin later.
router.get("/:id/posts", getTagAndPosts);

// Create new tag
router.post("/", createTagLimiter, createTag);

// Get, delete, and update tag via id
router.delete("/:id", 
  deleteTagLimiter,
  deleteTag
);

router.patch("/:id", 
  updateTagLimiter,
  updateTag
);


export default router;