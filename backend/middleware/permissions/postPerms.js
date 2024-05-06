const roles_map = require("../../config/roles_map");
const {createError} = require("../errorUtils");

/**
 * Verifies whether or not the request can access all of a user's post. 
 * 
 * If the user is an admin, or the user making the request, matches the ID of the user whose posts
 * being fetched (the user is fetching their own posts), then we can move on.
 * 
 * Else if the user isn't an admin, and the IDs don't match, then the request is not allowed to get the
 * posts, so return an status 401 error.
 */
function canGetUserPosts(req, res, next) {
  if (req.user.role != roles_map.admin && req.params.id != req.user.id) {
    const err = createError(401, "You are not allowed to access this resource");
    return next(err);
  }

  next();
}

module.exports = {
  canGetUserPosts,
}