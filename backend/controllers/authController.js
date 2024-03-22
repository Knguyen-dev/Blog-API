const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userValidators = require("../middleware/validators/userValidators");
const {body} = require("express-validator");
const handleValidationErrors = require("../middleware/handleValidationErrors");


/**
 * Function to create access token for a user.
 * 
 * @param {Object} user - A user object 
 * @returns {string} The access token
 */
function createAccessToken(user) {
	return jwt.sign({id: user.id,
      role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

/**
 * Function to create the refresh token for a user.
 * 
 * @param {Object} user - A user object.
 * @returns {string} The refresh token
 */
function createRefreshToken(user) {
	return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}


/**
 * Function for refreshing an access token
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const refresh = asyncHandler(async (req, res, next) => {


  /*
  1. Assuming cookieParser middleware is used, access the cookies of our 
  request object.
  2. If "cookies" exists and ".jwt" property is falsy, return error. This happens when cookies is 
    null or cookies.jwt is null. We just this conditional syntax because, if cookies 
    is null, trying to do cookies.jwt will result in a JavaScript error since you can't
    read the properties of a null value. By doing this we can just work around having to 
    deal with that javascript error or write a long conditional.  
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
    const accessToken = createAccessToken(foundUser);

    res.json({user: foundUser, accessToken})
  }));
})


/**
 * Function for signing up a user
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 */
const loginUser = [
  body("username").isLength({min: 1}).withMessage("Please enter your username!"),
  body("password").isLength({min:1}).withMessage("Please enter your password!"),
  handleValidationErrors,
  asyncHandler(async (req, res) => {

		// Try to login the user, if fails, an error is thrown, which will send back the error
    // message in json to our client
		const user = await User.login(req.body.username, req.body.password);

    // Create access and refresh tokens
		const accessToken = createAccessToken(user);
		const refreshToken = createRefreshToken(user);

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
    })

    // Store/update the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return the access token and user back
    res.status(200).json({user, accessToken})
	}
)]

/**
 * Function for logging out a user
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
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