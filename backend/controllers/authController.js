const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

/*
+ Functions for creating an access and refresh token:
- Access token: Should last for 15 minutes
- Refresh token: Should last for 3 days

- NOTE: For security reasons, we'll make it so the user has to log 
  in 3 days after they previously logged in. Also the payload 
  should probably just be the user.
*/
function createAccessToken(payload) {
	jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function createRefreshToken(payload) {
	jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "3d" });
}

// Signing up a user
const signupUser = [
	body("email")
		.trim()
		.escape()
		.isEmail()
		.withMessage("Not a valid email!")
		.isLength({
			max: 64,
		})
		.withMessage("Maximum email length is 64 characters"),
	body("username")
		.trim()
		.escape()
		.isLength({ min: 1, max: 32 })
		.withMessage(
			"Username has to be within 1 to 32 characters and alphanumeric!"
		)
		.isAlphanumeric()
		.withMessage(
			"Username has to be within 1 to 32 characters and alphanumeric!"
		)
		.custom(async (username) => {
			const user = await User.findOne({ username });
			if (user) {
				return false;
			} else {
				return true;
			}
		})
		.withMessage("Username is already taken!"),

	body("password")
		.trim()
		.isLength({ min: 8, max: 40 })
		.withMessage(
			"Password must be between 8 and 40 characters and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
		)
		.isStrongPassword({
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			"Password must be between 8 and 40 characters and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
		),
	body("confirmPassword")
		.custom((confirmPassword, { req }) => {
			return confirmPassword === req.body.password;
		})
		.withMessage("Passwords must match!"),

	body("fullName")
		.trim()
		.escape()
		.isLength({
			min: 1,
			max: 64,
		})
		.withMessage("Full name must be within 1 to 64 characters"),

	asyncHandler(async (req, res, next) => {
		// Sanitize and validate data
		const errors = validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
				[e.path]: e.msg,
			};
		}, {});

		// If there are errors with the sign up data, send back the errors as json
		if (Object.keys(errors).length != 0) {
			return res.status(400).json(errors);
		}

		// At this point, data is valid, so save user into the database and return successful response
		const { email, username, password, fullName } = req.body;
		const user = await User.signup(
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
  to be able to show the error messages on their respective fields, while on the login
  form we're just going to show one error message. 

  2. For a login process, we don't do as much validation. The main validation is 
    just checking if they filled in the fields, but also if their credentials 
    are correct.


*/
const loginUser = asyncHandler(async (req, res, next) => {
		const { username, password } = req.body;
    if (!username || !password) {
      const err = new Error("All fields must be filled!");
      err.statusCode = 400;
      return next(err)
    }

		// Try to login the user, if fails
		const user = await User.login(username, password);

		// At this point the user has been successfully logged in so create
		// the appropriate access and refresh tokens.
		const accessToken = createAccessToken({
			id: user.id,
		});
		const refreshToken = createRefreshToken({id: user.id});
	})

