
import {Router} from "express";
import {loginUser, logoutUser, signupUser, refresh, forgotPassword, resetPassword, verifyEmail} from "../controllers/authController";
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

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:passwordResetToken", resetPassword);
router.post("/verifyEmail/:verifyEmailToken", verifyEmail);

export default router;