
import {Router} from "express";
import {loginUser, logoutUser, signupUser, refresh, verifyEmail} from "../controllers/authController";
import { loginLimiter, signupLimiter } from "../middleware/limiters/authLimiter";


const router = Router();

// Login route
router.post("/login", loginLimiter, loginUser);

// logout route
router.get("/logout", logoutUser);

// Sign up route
router.post("/signup", signupLimiter, signupUser);

// Refresh access tokens route
router.get("/refresh", refresh);

router.get("/verify-email/:token", verifyEmail);

export default router;