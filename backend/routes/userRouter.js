const router = require("express").Router();
const verifyJWT = require("../middleware/verifyJWT");

const userController = require("../controllers/userController");

// Add verifyJWT middleware before all user routes to protect them.
router.use(verifyJWT)

// Get a user by id
router.get("/:userID", userController.getUserById)

// Delete user by id: DELETE /users/:id
router.delete("/:userID", userController.deleteUserById);

// Update a user's fullName
router.patch("/:userID/fullName", userController.updateFullName);

// Update a user's username
router.patch("/:userID/username", userController.updateUsername);


// Update a user's password 
// router.patch("/:userID/password")







module.exports = router;