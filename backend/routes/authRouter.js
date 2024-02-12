const router = require("express").Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

// Login route
router.post("/login", loginLimiter, authController.loginUser);

// logout route
router.get("/logout", authController.logoutUser);

// Sign up route
router.post("/signup", authController.signupUser);

// Refresh access tokens route
router.get("/refresh", authController.refresh);




module.exports = router