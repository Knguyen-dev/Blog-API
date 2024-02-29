

const verifyRoles = (...allowedRoles) => {

  return (req, res, next) => {
    const rolesArr = [...allowedRoles];

    /*
    - Takeaway: If the user's role is included in the allow list ,then
      we'll let then access the resource, else no.
    */

    const isAuthorized = rolesArr.includes(req.user.role);

    if (!isAuthorized) {
      return res.status(401).json({ message: "Unauthorized to access this resource!" });
    }

    // They're authorized at this point so go to the next middleware.
    next();
  }
}

module.exports = verifyRoles;