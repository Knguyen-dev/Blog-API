
import {Router} from "express";
import {loginUser, logoutUser, signupUser, refresh, forgotPassword, forgotUsername, resetPassword, verifyEmail} from "../controllers/authController";
import { 
  loginLimiter, 
  signupLimiter, 
  forgotPasswordLimiter, 
  forgotUsernameLimiter, 
  resetPasswordLimiter, 
  verifyEmailLimiter
} from "../middleware/limiters/authLimiter";


const router = Router();

// Login route
router.post("/login", loginLimiter, loginUser);

// logout route
router.get("/logout", logoutUser);

// Sign up route
router.post("/signup", signupLimiter, signupUser);

// Refresh access tokens route
router.get("/refresh", refresh);

// Route for sending a forgot password link to the user's email
router.post("/forgotPassword", forgotPasswordLimiter, forgotPassword);

// Route for sending a forgot username email to the user's email
router.post("/forgotUsername", forgotUsernameLimiter, forgotUsername);

// Route for confirming a password reset 
router.post("/resetPassword/:passwordResetToken", resetPasswordLimiter, resetPassword);

// Route for confirming an email verification
router.post("/verifyEmail/:verifyEmailToken", verifyEmailLimiter, verifyEmail);

export default router;