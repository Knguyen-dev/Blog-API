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
const verifyJWT = asyncHandler(async (req, res, next) => {
  /*
  1. Check capitalized and uncapitalized version. Since there's no standard, it's just better
    to check both.
  2. If authHeader is defined, we extract the token since authHeader = "Bearer <access_token>".
  This means if authHeader is null, then token is null. If the token is null return error to our
  error handling function.
  */
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1]


  if (!token) {
    const err = new Error("Unauthorized, you need to have an access token!")
    err.statusCode = 401;
    next(err);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      err.message = "Unauthorized, access token you gave is invalid!";
      err.statusCode = 401;
      /*
      - Typically we can use 'throw' to give the error to the error handling middleware.
        But here we have to use next so that the error gets sent to the error handling middleware 
        rather than stopping our app. The reason for this is jwt.verify doesn't support throwing 
        errors in a way that can be caught by asyncHandler.
      */
      next(err);
    }

    /*
    - Set the user property on the request object to represent the 
      user that's currently making the request
    */
    req.user = user;
    next();
  })
})


module.exports = verifyJWT;