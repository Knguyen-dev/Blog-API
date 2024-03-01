const router = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");
const roles_list = require("../config/roles_list");
const userController = require("../controllers/userController");
const userPerms = require("../middleware/permissions/userPerms");
const userLimiter = require("../middleware/limiters/userLimiter");
/*
- No one other than admins should really be focused on getting the information
  of all users, or getting the information of all users.
*/
router.get("/", verifyRoles(roles_list.admin), userController.getUsers);




// Plan to use this for the user profile page to see another user's profile.
// Though, we'll probably want the client side route to be "/dashboard/some_username" when
// it's another user
router.get("/:id", userController.getUserById)


// Limit amount of requests for editing a user account
router.use(userLimiter.editUserLimiter)



// Route for deleting users; apply canDeleteUser to that route only
router.delete("/:id", userPerms.canDeleteUser, userController.deleteUser);

// Route for updating user's role, specifically for administrators only
router.patch("/:id/role", verifyRoles(roles_list.admin), userController.changeRole);

// Routes for updating and editing users; apply canEditUser to all of the below routes
router.use("/:id", userPerms.canEditUser);
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



module.exports = router;