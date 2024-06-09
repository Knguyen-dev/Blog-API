import {Router} from "express";
import {verifyEditorOrAdmin, verifyAdmin} from "../middleware/roleVerification";
import {verifyJWT} from "../middleware/tokenUtils";
import {getCategories, getCategoryAndPublishedPosts, createCategory, getCategoryAndPosts, deleteCategory, updateCategory} from "../controllers/categoryController";

import {
  createCategoryLimiter,
  updateCategoryLimiter,
  deleteCategoryLimiter
} from "../middleware/limiters/categoryLimiter";



const router = Router();

// Get all categories; should be public
router.get("/", getCategories);

// Gets category and published posts associated with it
router.get("/:id/posts/published", getCategoryAndPublishedPosts);

// Subsequent routes require authentication
router.use(verifyJWT);

// Create create category
router.post("/", verifyEditorOrAdmin, createCategoryLimiter, createCategory);

router.get("/:id/posts", verifyAdmin, getCategoryAndPosts);

// delete, and updating categories via id
router.delete("/:id", verifyEditorOrAdmin, deleteCategoryLimiter, deleteCategory);
router.patch("/:id", verifyEditorOrAdmin, updateCategoryLimiter, updateCategory);

export default router;