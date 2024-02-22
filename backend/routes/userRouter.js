const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const roles_list = require("../config/roles_list");
const userController = require("../controllers/userController");
const verifyOwnAccount = require("../middleware/verifyOwnAccount");
const { verify } = require("jsonwebtoken");
// 
router.get("/", verifyRoles(roles_list.admin), userController.getUsers);

// Get a user by id; make it so we should be an administrator to do this
router.get("/:id", userController.getUserById)


// Then for requests that affect user accounts, ensure the person
// making the request can only modify their own account; Good for production
// router.use(verifyOwnAccount);


// Delete user by id: DELETE /users/:id
router.delete("/:id", userController.deleteUserById);


/*
+ PUT vs PATCH requests:

1. PUT: Used when updating an entire resource or replacing it with 
  a new version.I f you send the same PUT multiple times, the results 
  should be the same as it were if it was only sent once (Idempotent).
2. PATCH: Used when doing partial modifications to a resource. Good 
  when updating specific fields without affecting the 
  rest of the resource's properties.
*/

// Update avatar
router.patch("/:id/avatar", userController.updateAvatar);


// Update username, email, and full name
// router.patch("/:id")

// Update password; when finished we log out the user.
// router.patch("/:id/password")




// Update a user's fullName
router.patch("/:id/fullName", userController.updateFullName);

// Update a user's username
router.patch("/:id/username", userController.updateUsername);




module.exports = router;