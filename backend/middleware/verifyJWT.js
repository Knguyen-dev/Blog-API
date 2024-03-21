const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


/**
 * Checks whether a request has a jwt token. If so let the request go on to the next middleware, 
 * else stop the request from going any further. This will be used to protect api routes.
 * 
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next function
 * @returns 
 */
const verifyJWT = (req, res, next) => {
  /*
  1. Check capitalized and uncapitalized version. Since there's no standard, it's just better
    to check both.
  2. If authHeader is defined, we extract the token since authHeader = "Bearer <access_token>".
  This means if authHeader is null, then token is null. If the token is null return error to our
  error handling function.
  */
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1]

  const err = new Error("");
  err.statusCode = 401;


  if (!token) {
    err.message = "Unauthorized, you need to have an access token!";
    throw err;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, asyncHandler(async (err, user) => {
    if (err) {
      err.message = "Unauthorized, access token you gave is invalid!";
      throw err;
    }


    /*
    - Set the user property on the request object to represent the 
      user that's currently making the request
    */
    req.user = user;
    next();
  }))
}

module.exports = verifyJWT;