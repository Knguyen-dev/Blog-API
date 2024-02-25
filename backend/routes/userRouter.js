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
// making the request can only modify their own account; 
// However we should also see whether a user is an admin to do that
// router.use(verifyOwnAccount);


// Delete user by id: DELETE /users/:id
router.delete("/:id", userController.deleteUser);


/*
+ PUT vs PATCH requests:

1. PUT: Used when updating an entire resource or replacing it with 
  a new version.I f you send the same PUT multiple times, the results 
  should be the same as it were if it was only sent once (Idempotent).
2. PATCH: Used when doing partial modifications to a resource. Good 
  when updating specific fields without affecting the 
  rest of the resource's properties.
*/

// Update avatar and deleting the avatar
router.patch("/:id/avatar", userController.updateAvatar);
router.delete("/:id/avatar", userController.deleteAvatar);

router.patch("/:id/username", userController.updateUsername);
router.patch("/:id/email", userController.updateEmail);
router.patch("/:id/fullName", userController.updateFullName);

/*
- Updating the password for a logged in user:
1. We should have old and new password in the body. 
2. User id in the params and auth token in the header.
3. Then on client side, when it gets confirmation that password 
  change was successful, it will make a request to log out the user.
*/
router.patch("/:id/password", userController.changePassword);





// When a user wants to change their password; 
// This shouldn't be confused with resetting a password
// /:id/password





module.exports = router;