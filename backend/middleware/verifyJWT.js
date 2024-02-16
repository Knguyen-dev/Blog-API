/*
+ Verify JWT: 
- Middleware that verifies if a request has a valid jwt access 
  token. We'll then use this middleware to protect api routes and ensure 
  that in order for a request to even go through, it must have a valid 
  access token.

*/

const jwt = require("jsonwebtoken");
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
    return res.status(401).json({message :"Unauthorized, you need to have an access token!"})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, asyncHandler(async (err, user) => {
    if (err) {
      return res.status(401).json({message: "Unauthorized, access token you gave is invalid!"})
    }


    /*
    - NOTE: Access token has username and roles so put those in our request object
    */
    req.username = user.username;
    req.role = user.role;
    next();
  }))
}

module.exports = verifyJWT;