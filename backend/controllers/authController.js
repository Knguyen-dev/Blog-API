const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userValidators = require("../middleware/validators/userValidators");
const {body} = require("express-validator");
const { createError, handleValidationErrors } = require("../middleware/errorUtils");
const tokenUtils = require("../middleware/tokenUtils");

/**
 * Function for refreshing an access token
 * 
 * NOTE: We assume the cookieParser middleware is used to allow us to access the 
 * cookies in the request object.
 * 
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const refresh = asyncHandler(async (req, res, next) => {
  /*
  - When req.cookies is null or cookies.jwt is null. We just this conditional syntax because, 
    if cookies is null, trying to do cookies.jwt will result in a JavaScript error since you can't
    read the properties of a null value. 
  */
  const cookies = req.cookies; 
  if (!cookies?.jwt) {
    const err = new Error("Unauthorized, you need to have the refresh token cookie to refresh!");
    err.statusCode = 401;
    return next(err);
    
  }
  const refreshToken = cookies.jwt;

  /*
  - Ensure that the token has been provided or issued by our system. If it exists
  then it's a valid token, but if it doesn't exist it could have been
  already revoked, tampered with, or just it wasn't a token issued by us.
  */
  const foundUser = await User.findOne({refreshToken});
  if (!foundUser) {
    const err = new Error("Forbidden, we couldn't find a user with your refresh token");
    err.statusCode = 403;
    return next(err);
  }

  // Verify the token, this can check things usch as when token expires
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler (async (error) => {

    if (error) {
      const err = new Error("Forbidden, refresh token was invalid. Probably expired.");
      err.statusCode = 403;
      return next(err);
    }

    // Else user exists and the refresh token is valid, so create and return the access token as json
    const accessToken = tokenUtils.generateAccessToken(foundUser);

    res.json({user: foundUser, accessToken})
  }));
})

/**
 * Function for signing up a user
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const signupUser = [
  userValidators.email,
  userValidators.username,
  userValidators.password,
  userValidators.confirmPassword,
  userValidators.fullName,
  handleValidationErrors,
	asyncHandler(async (req, res) => {
		// At this point, data is valid, so save user into the database and return successful response
		const { email, username, password, fullName } = req.body;
    // Everything should be valid, so proceed with user signup
    const user = await User.signup(
      email,
      username,
      password,
      fullName
    );
    res.status(200).json(user);
	}),
];

/**
 * Function for logging in a user
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const loginUser = [
  body("username").isLength({min: 1}).withMessage("Please enter your username!"),
  body("password").isLength({min:1}).withMessage("Please enter your password!"),
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {

		
    // Try to log the user in. If we aren't returned a user, then that means the login failed
		const user = await User.login(req.body.username, req.body.password);
    if (!user) {
      const err = createError(400, "Username or password is incorrect!");
      return next(err)
    }

    // Create access and refresh tokens
		const accessToken = tokenUtils.generateAccessToken(user);
		const refreshToken = tokenUtils.generateRefreshToken(user);

    // Set the refresh token cookie
    tokenUtils.setRefreshTokenCookie(res, refreshToken);

    // Store/update the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return the access token and user back
    res.status(200).json({user, accessToken})
	}
)]

/**
 * Function for logging out a user
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  // If 'cookies.jwt' doesn't exist, not an error but nothing really happened
  if (!cookies?.jwt) {
    return res.status(204).json({message: "No cookies to clear!"});
  }

  // Get refresh token
  const refreshToken = cookies.jwt;

  /*
  - Cookie named 'jwt' exists so clear it. For this to work we 
    have to pass in all of the options we used to create the cookie.
  */
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true
  })

  /*
  - If user: Token was valid and issued by our system. Here we can clear the token
    from the user's record and our database.
  - If not user: Token provided could have already been revoked from our system, could 
    be the token has been tampered with, or a different jwt token that wasn't issued by our 
    system. In any case it's not valid. So we'll send back a 204.
  */
  const user = await User.findOne({refreshToken});
  if (!user) {
    return res.status(204).json({message: "Cookies were cleared, and no user was found with that refresh token!"});
  }
  
  user.refreshToken = "";
  await user.save();

  res.status(200).json({message: "Refresh token cleared and user was logged out"});
})


module.exports = {
  signupUser,
  loginUser,
  refresh,
  logoutUser,
}