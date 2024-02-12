/*
+ Verify JWT: 
- Middleware that verifies if a request has a valid jwt access 
  token. We'll then use this middleware to protect api routes and ensure 
  that in order for a request to even go through, it must have a valid 
  access token.

*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

/*
1. Check both the capitalized and uncapitalized versions. There's no standard 
  so it's best to always check both.
2. If authHeader is defined, we extract the token since authHeader = "Bearer <access_token>".
  This means if authHeader is null, then token is null. If the token is null return error to our
  error handling function.
*/
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    const err = Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, asyncHandler(async (err, user) => {
    if (err) {
      const err = Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }


    /*
    - If there were no issues in verifying the token, create 
      a userID property in our request object that we can access
      in later middleware. Then call next() to move on to the 
      next middleware.

    - NOTE: if your users have 'roles' and you defined roles in your 
      jwt payload, you'd do req.roles here also. Also note this, apparently
      it's not recommended to verify the user against the database in this 
      stage.
    */
    req.userID = user.id;
    next();
  }))
}

module.exports = verifyJWT;