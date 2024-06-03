import {Router} from "express";
import {
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  getPosts,
  getPublishedPosts,
  getPostByID,
  getPublishedPostBySlug
} from "../controllers/PostController";
import {
  verifyAdmin,
  verifyEditorOrAdmin
} from "../middleware/roleVerification";
import {verifyJWT} from "../middleware/tokenUtils";

const router = Router();

// Getting only published posts; should be public to everyone even unregistered users
router.get("/published", getPublishedPosts);
router.get("/published/slug/:slug", getPublishedPostBySlug);


// Other routes are for registered users; for editors and admins too I think
router.use(verifyJWT);

// Getting all posts; later we should just make it for administrators only
router.get("/", verifyAdmin, getPosts);

// Creating a post; must be an editor or admin to do this
router.post("/", verifyEditorOrAdmin, createPost);

// Getting a specific post's details; allows admins to view anyone's posts
router.get("/:id", verifyEditorOrAdmin, getPostByID);

// Deleting a post (editors can delete their own whilst admins can delete anyone's)
router.delete("/:id", verifyEditorOrAdmin, deletePost);

// Updating the status of a post only (for admins only)
router.patch("/:id/status", verifyAdmin, updatePostStatus);

// Updating a post in its entirety (users can only update their own posts)
router.put("/:id", verifyEditorOrAdmin, updatePost);


export default router;