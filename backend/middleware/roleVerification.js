const roles_map = require("../config/roles_map");


/**
 * A higher-order function that creates middleware functions to protect routes based on the allowed roles.
 * 
 * @param {...string} allowedRoles - The roles that are allowed to access the route
 * @returns {function} Returns a middleware function that checks if the user's role is included in the allowedRoles array. 
 *                     If the user's role is included, the middleware allows the request to proceed; otherwise, it returns a 401 Unauthorized response.
 */
const verifyRoles = (...allowedRoles) => {

  return (req, res, next) => {

    // Ensure there is a logged in user.
    if (!req.user) {
      const err = new Error("Unauthorized, user needs to be logged in!");
      err.statusCode = 401;
      return next(err);
    }


    const rolesArr = [...allowedRoles];
    /*
    - If the user's role is included in the allow list ,then
      we'll let then access the resource, else no.
    */
    const isAuthorized = rolesArr.includes(req.user.role);

    if (!isAuthorized) {
      const err = new Error("Unauthorized to access this resource!");
      err.statusCode = 401;
      return next(err);
    }

    // They're authorized at this point so go to the next middleware.
    next();
  }
}


const verifyAdmin = verifyRoles(roles_map.admin);
const verifyEditorOrAdmin = verifyRoles(roles_map.editor, roles_map.admin);


module.exports = {
  verifyRoles,
  verifyAdmin,
  verifyEditorOrAdmin,
};