/*
+  Middleware for User Access Control
  
- This module contains middleware functions used to enforce access control rules
  for user-related HTTP requests. These middleware functions determine whether
  a request is authorized to delete or edit a user account based on the user's role
  and the target user ID specified in the request parameters.
  
- Note: 
  1. Currently, this module only implements authorization checks for deleting
  and editing user accounts. Other access control checks may be added in the future
  as the application's requirements evolve.

  2. If you later realize that canDeleteUser and canEditUser have the same requirements, 
    you can name the resulting function 'canModifyUser' or 'canManageUser'.

*/

const roles_list = require("../../config/roles_list");


/*
+ Middleware: Can Delete User
  
- Checks if the requester is authorized to delete a user account. A user can be
  deleted if the requester is an admin OR if the ID of the requester matches the
  user being deleted, indicating self-deletion.
  
- Returns a 401 Unauthorized response if the requester lacks the necessary permissions
  to delete the user account.
*/
function canDeleteUser(req, res, next) {
  if (req.user.role !== roles_list.admin && req.user.id !== req.params.id) {
    return res.status(401).json({message: "Unauthorized to delete said user!"});
  }
  next();
}


/*
+ Middleware: Can Edit User
  
- Checks if the requester is authorized to edit/modify a user account. A user can be
  edited if the requester is an admin OR if the ID of the requester matches the
  user being edited, indicating self-editing.
  
- Returns a 401 Unauthorized response if the requester lacks the necessary permissions
  to edit the user account.
*/
function canEditUser(req, res, next) {
  if (req.user.role !== roles_list.admin && req.user.id !== req.params.id) {
    return res.status(401).json({message: "Unauthorized to edit said user!"});
  } 
  next();
}


module.exports = {
  canEditUser,
  canDeleteUser
}