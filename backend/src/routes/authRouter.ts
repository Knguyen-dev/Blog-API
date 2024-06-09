
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



router.post("/forgotPassword", forgotPasswordLimiter, forgotPassword);
router.post("/forgotUsername", forgotUsernameLimiter, forgotUsername);
router.post("/resetPassword/:passwordResetToken", resetPasswordLimiter, resetPassword);
router.post("/verifyEmail/:verifyEmailToken", verifyEmailLimiter, verifyEmail);

export default router;