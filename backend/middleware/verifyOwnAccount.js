const asyncHandler = require("express-async-handler");
const roles_list = require("../config/roles_list");

/*

- Middleware that checks whether the user is updating their own account or not:
- With verifyJWT, we're only checking if the user actually logged in, by checking 
  their access token. However, even with a good access token the user could theoretically
  use it on a user route '/users/:id', and update the information of another user.
  We'll know this when they're hitting the id endpoint different from the 
  one on the request object!

- As a result, with this middleware, we'll check if the id of the user making
  the request matches the 'id' parameter. This is good for those /users/:id endpoints
  to ensure the user is changing their own account infomration.

- NOTE: We should make an exception for admins. They should be allowed to edit 
  anyone, even other admins I guess.
*/
  


const verifyOwnAccount = (req, res, next) => {

  // If id parameter is different from id of logged in user then invalid
  if (req.params.id !== req.user.id) {
    return res.status(400).json({message: "Unauthorized: You can only update/manage your own account info"})
  }

  // Else IDs match so they're trying to access the endpoint associated with 
  // their user info.
  next();
}

module.exports = verifyOwnAccount;