const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


/**
 * Function to create access token for a user.
 * 
 * @param {Object} user - A user object 
 * @returns {string} The access token
 */
function generateAccessToken(user) {
	return jwt.sign({id: user.id,
      role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15min" });
}

/**
 * Function to create the refresh token for a user.
 * 
 * @param {Object} user - A user object.
 * @returns {string} The refresh token
 */
function generateRefreshToken(user) {
	return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

/**
 * Function to create the refresh token for a user.
 * 
 * @param {Object} res - A response object.
 * @param {string} refreshToken - The refresh token
 */
function setRefreshTokenCookie(res, refreshToken) {
  /*
  + Create a secure cookie on our response for our refresh token: 
  1. httpOnly: Set to true so that this cookie that we've
    created is only accessible by the web server. This instructs the browser 
    to restrict access to the cookie, such that it can't be accessed through
    client-side JavaScript. So your React frontend can't even read or interact
    with the cookie, however your Express backend will be able to read it.
  2. secure: Ensures it uses https.
  3. sameSite: Put 'None' so that it's a cross-site cookie.
    Our front end application needs to be able to have and 
    store this cookie, and our front end app is going to be 
    on a different origin since it runs on a different port.
    Again rest api at one server, and our front end at another server.
  4. maxAge: The expiration date, so here you'd match it to 
    what the refresh token's expiration date was in our 
    createRefreshToken function. 
  */
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000
  });
}


/**
 * Checks whether a request has a jwt token. If so let the request go on to the next middleware, 
 * else stop the request from going any further. This will be used to protect api routes.
 * 
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next function
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
    return next(err);
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
      return next(err);
    }

    /*
    - Set the user property on the request object to represent the 
      user that's currently making the request
    */
    req.user = user;
    next();
  })
})



module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  verifyJWT
}