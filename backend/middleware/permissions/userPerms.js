const roles_map = require("../../config/roles_map");


/**
 * Checks if requester is authorized to modify a user account. A user can be modified
 * when they're an admin or if the ID of the requestor matches the ID of the 
 * user being edited (indicates that a user is updating their own account).
 * 
 */
function canModifyUser(req, res, next) {
  if (req.user.role !== roles_map.admin && req.user.id !== req.params.id) {
    const err = new Error("Unauthorized to modify said user!");
    err.statusCode = 401;
    return next(err);
  } 
  next();
}



module.exports = {
  canModifyUser
}