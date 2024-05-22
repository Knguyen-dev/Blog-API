import {Router} from "express";
import {verifyEditorOrAdmin, verifyAdmin} from "../middleware/roleVerification";
import {verifyJWT} from "../middleware/tokenUtils";
import {getCategories, getCategoryAndPublishedPosts, createCategory, getCategoryAndPosts, deleteCategory, updateCategory} from "../controllers/categoryController";

const router = Router();

// Get all categories; should be public
router.get("/", getCategories);

// Gets category and published posts associated with it
router.get("/:id/posts/published", getCategoryAndPublishedPosts);

// Subsequent routes require authentication
router.use(verifyJWT);

// Create create category
router.post("/", verifyEditorOrAdmin, createCategory);

// Get, delete, and updating categories via id
router.get("/:id/posts", verifyAdmin, getCategoryAndPosts);
router.delete("/:id", verifyEditorOrAdmin, deleteCategory);
router.patch("/:id", verifyEditorOrAdmin, updateCategory);

export default router;