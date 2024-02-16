

const verifyRoles = (...allowedRoles) => {

  return (req, res, next) => {
    const err = Error("Your role isn't cool enough to get this resource!");
    err.statusCode = 401;


    if (!req.role) {
      return next(err);
    }
    const rolesArr = [...allowedRoles];

    /*
    - Takeaway: If the user's role is included in the allow list ,then
      we'll let then access the resource, else no.
    */

    const result = rolesArr.includes(req.role);

    if (!result) {
      return next(err);
    }

    // They're authorized at this point so go to the next middleware.
    next();
  }
}

module.exports = verifyRoles;