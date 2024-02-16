const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const userValidator = require("../middleware/userValidators");

/*
+ Functions for creating an access and refresh token:
- Access token: Should last for 15 minutes
- Refresh token: Should last for 1 days

- NOTE: For security reasons, we'll make it so the user has to log 
  in 3 days after they previously logged in. Also the payload 
  should probably just be the user.
*/
function createAccessToken(user) {
	return jwt.sign({username: user.username,
      role: user.role,}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15min" });
}

function createRefreshToken(user) {
	return jwt.sign({username: user.username}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}



/*
+ Signing up a user:
- If there are errors with the sign up data, send back the errors as json

- NOTE: Since we have an error object that has messages corresponding to 
  specific fields, it'd be easier to send back the 'errors' object so that
  the front end form can display errors for respective fields. 

*/
const signupUser = [
  userValidator.email,
  userValidator.username,
  userValidator.password,
  userValidator.confirmPassword,
  userValidator.fullName,
	
	asyncHandler(async (req, res, next) => {
		// Sanitize and validate data
		const errors = validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
				[e.path]: e.msg,
			};
		}, {});
		if (Object.keys(errors).length != 0) {
			return res.status(400).json(errors);
		}

		// At this point, data is valid, so save user into the database and return successful response
		const { email, username, password, fullName } = req.body;
		await User.signup(
			email,
			username,
			password,
			fullName
		);

    // Respond indicating it was a success!
		res.status(200).json({ message: "User sign up successful!" });
	}),
];

/*
+ Logging in a user:
- Route for logging or authenticating a user.

- NOTE: 
  1. When signing up a user, we had our logic for checking if the username 
  was already taken in a custom validator. However, when we're doing our login
  logic, we placed our database checks in our static method inside the '/models/User'
  file. The only reason I'm doing it this way is because on the sign up form I want 
  to be able to show the error messages on their respective fields, so if there
  was a server-side error with the username we'd show it on the form.
  
  2. While on the login form we're just going to show one error message that doesn't
  particularly pertain to a certain field. So 'All fields must be filled' or 
  'incorrect username or password' don't refer/talk about a specific field.
  Unlike the message 'not a valid email' or 'password isn't meeting standards'.

  3. Of course, even unexpected errors can happen whilst on the sign up form such
    as the front end not correctly connecting to the backend, which is why we'll
    definite consider showing a more general 'error' message in those cases

  4. For a login process, we don't do as much validation. The main validation is 
  just checking if they filled in the fields, but also if their credentials 
  are correct.


*/
const loginUser = asyncHandler(async (req, res, next) => {
		const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({message: "All fields must be filled!" })
    }

		// Try to login the user, if fails, an error is thrown, which will send back the error
    // message in json to our client
		const user = await User.login(username, password);

    /*
    - At this point the user has been successfully logged in so create
		 the appropriate access and refresh tokens. Access token has the 
    username and role, whilst the refresh token just has the username. 
    The former is needed so that we can do server-side role validation, while
    for the latter, we only need the username to identify who it is when we're 
    refreshing.
    */
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

    - Takeaway: Only our accessToken is handled by our react app, 
      while our refresh token isn't. However, we will make sure that 
      when our react-app makes requests, it sends a request with the refresh token cookie.
      Also 'jwt' just names the cookie 'jwt', and that is what we'll look for.
    */
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000
    })

    // Store/update the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return the access token and user back
    res.status(200).json({user: {email: user.email, username: user.username, role: user.role, fullName: user.fullName }, accessToken})
	}
)

/*
+ Refresh endpoint: Endpoint for refreshing an access token
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
    return res.status(401).json({message: "Unauthorized, you need to have the refresh token cookie to refresh!"})
  }
  const refreshToken = cookies.jwt;


  /*
  - Ensure that the token has been provided or issued by our system. If it exists
  then it's a valid token, but if it doesn't exist it could have been
  already revoked, tampered with, or just it wasn't a token issued by us.
  */
  const foundUser = await User.findOne({refreshToken}).select("-password -__v -refreshToken");
  if (!foundUser) {
    return res.status(403).json({message: "Forbidden, we couldn't find a user with your refresh token"})
  }

  // Verify the token, this can check things usch as when token expires
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler (async (error, payload) => {

    if (error) {
      return res.status(403).json({message: "Forbidden, refresh token was invalid. Probably expired."})
    }

    // Else user exists and the refresh token is valid, so create and return the access token as json
    const accessToken = createAccessToken(foundUser);
    res.json({user: foundUser, accessToken})
  }));
})

/*
+ Logging out: Endpoint for logging out the user. We'll clear the jwt 
  refresh token stored in their cookies and database
- NOTE: On the client side, you should also delete access token from the state
*/
const logoutUser = asyncHandler(async (req, res, next) => {
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