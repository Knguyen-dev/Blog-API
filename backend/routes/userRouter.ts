import { Router } from "express";
import {verifyJWT} from "../middleware/tokenUtils";
import {
  verifyAdmin
} from "../middleware/roleVerification";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateAvatar,
  deleteAvatar,
  updateUsername,
  updateEmail,
  updateFullName,
  changePassword
}  from "../controllers/userController";
import { getPostsByUser } from "../controllers/PostController";
import { canModifyUser} from "../middleware/permissions/userPerms";
import {editUserLimiter} from "../middleware/limiters/userLimiter";

const router = Router();

// Routes only accessible for authenticated users
router.use(verifyJWT);

// Get all users; for admins only
router.get("/", verifyAdmin, getUsers);

// Get user by id
router.get("/:id", getUserById)

// Get user's posts
router.get("/:id/posts", getPostsByUser);


// Limit amount of requests for editing a user account
router.use(editUserLimiter)


// Apply 'canModifyUser' middleware to all of the below routes
router.use("/:id", canModifyUser);

// Route for deleting users; 
router.delete("/:id", deleteUser);

// Routes for updating and editing users
router.patch("/:id/avatar", updateAvatar);
router.delete("/:id/avatar", deleteAvatar);
router.patch("/:id/username", updateUsername);
router.patch("/:id/email", updateEmail);
router.patch("/:id/fullName", updateFullName);

// Update a password of a specific user
router.patch("/:id/password", changePassword);

export default router;