const router = require("express").Router();
const authController = require("../controllers/authController");
const authLimiter = require("../middleware/limiters/authLimiter");

// Login route
router.post("/login", authLimiter.loginLimiter, authController.loginUser);

// logout route
router.get("/logout", authController.logoutUser);

// Sign up route
router.post("/signup", authLimiter.signupLimiter, authController.signupUser);

// Refresh access tokens route
router.get("/refresh", authController.refresh);

module.exports = router