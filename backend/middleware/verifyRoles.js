/**
 * A higher-order function that creates middleware functions to protect routes based on the allowed roles.
 * 
 * @param {...string} allowedRoles - The roles that are allowed to access the route
 * @returns {function} Returns a middleware function that checks if the user's role is included in the allowedRoles array. 
 *                     If the user's role is included, the middleware allows the request to proceed; otherwise, it returns a 401 Unauthorized response.
 */
const verifyRoles = (...allowedRoles) => {

  return (req, res, next) => {
    const rolesArr = [...allowedRoles];

    /*
    - Takeaway: If the user's role is included in the allow list ,then
      we'll let then access the resource, else no.
    */
    const isAuthorized = rolesArr.includes(req.user.role);

    if (!isAuthorized) {
      const err = new Error("Unauthorized to access this resource!");
      err.statusCode = 401;
      throw err;
    }

    // They're authorized at this point so go to the next middleware.
    next();
  }
}

module.exports = verifyRoles;