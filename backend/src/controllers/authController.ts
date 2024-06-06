import User from "../models/User";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userValidators from "../middleware/validators/userValidators";
import {body} from "express-validator";
import { createError, handleValidationErrors } from "../middleware/errorUtils";
import {generateAccessToken, generateRefreshToken, setRefreshTokenCookie} from "../middleware/tokenUtils";
import {Request, Response, NextFunction} from "express";
import authServices from "../services/auth.services";
import employeeCache from "../services/caches/EmployeeCache";
import { verifyPassword } from "../middleware/passwordUtils";
import EmailToken from "../models/EmailToken";
import { generateEmailToken, generateVerifyEmailURL } from "../middleware/tokenUtils";
import sendVerifyEmail from "../services/email/sendVerifyEmail";
import {EmailTokenPayload} from "../types/Request";


/**
 * Function for refreshing an access token
 * 
 * NOTE: We assume the cookieParser middleware is used to allow us to access the 
 * cookies in the request object.
 */
const refresh = async (req: Request, res: Response, next: NextFunction) => {
  /*
  - When req.cookies is null or cookies.jwt is null. We just this conditional syntax because, 
    if cookies is null, trying to do cookies.jwt will result in a JavaScript error since you can't
    read the properties of a null value. 
  */
  const cookies = req.cookies; 
  if (!cookies?.jwt) {
    const err = createError(401, "Unauthorized, you need to have the refresh token cookie to refresh!");
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
    const err = createError(403, "Forbidden, we couldn't find a user with your refresh token");
    return next(err);
  }

  // Verify the token, this can check things usch as when token expires
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (error: jwt.VerifyErrors | null) => {

    if (error) {
      const err = createError(403, "Forbidden, refresh token was invalid. Probably expired.");
      return next(err);
    }

    // Else user exists and the refresh token is valid, so create and return the access token as json
    const accessToken = generateAccessToken(foundUser);

    res.json({user: foundUser, accessToken})
  });
}

/**
 * Function for signing up a user
 */
const signupUser = [
  userValidators.email,
  userValidators.username,
  userValidators.password,
  userValidators.confirmPassword,
  userValidators.fullName,
  handleValidationErrors,
	asyncHandler(async (req: Request, res: Response) => {

    const { email, username, password, fullName } = req.body;
    
    // Attempt to signup/create the user
    const user = await authServices.signupUser(email, username, password, fullName);

    // Create an email token in the database, create link to verify a user's email, and email that link to the user
    const emailToken = await EmailToken.create({
      userId: user._id,
      token: generateEmailToken(user.email)
    })    
    const verifyEmailURL = generateVerifyEmailURL(emailToken.token);
    await sendVerifyEmail(user.email, user.fullName, verifyEmailURL);

    // Return message indicating the sign up went well
    res.status(200).json({
      message: 'Sign-up successful! A verification email has been sent to your email address. Please check your email to verify your account.',
    });
	}),
];

/**
 * Function for logging in a user
 */
const loginUser = [
  body("username").isLength({min: 1}).withMessage("Please enter your username!"),
  body("password").isLength({min:1}).withMessage("Please enter your password!"),
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    /*
    - Attempt to find user via their username
    No user was found with that username, however for our error we should 
    show indicate that either the usernaem or password was incorrect. This 
    prevents a malicious user from gleaning any login information.
    */
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      throw createError(400, "Username or password was incorrect!");
    }

    // Verify if the plain-text password the user entered, matches the password hash in the database
    const isMatch = await verifyPassword(req.body.password, user.password);
    if (!isMatch) {
      throw createError(400, "Username or password was incorrect!");
    }

    // Login process successful (credentials valid and account verified); Create an access and refresh token for the user
		const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update the lastLogin time and update the refresh token; save changes to the database
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    // Set the refresh token as a cookie in the response header.
    setRefreshTokenCookie(res, user.refreshToken);

    /*
    - If user is an employee, they just logged in and their lastLogin attribute was 
      updated, so invalidate the current cache of employees so that we'll
      fetch fresh data.
    */
    if (user.isEmployee()) {
      await employeeCache.deleteCachedEmployees(); 
    }

    // Return the access token and user back
    res.status(200).json({user, accessToken})
	}
)]




/**
 * Sends a verification email to update a user's current email.
 * 
 */
const resendVerifyEmail = asyncHandler(async(req, res, next) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    throw createError(400, "No account found with that email!");
  }

  if (user.isVerified) {
    throw createError(400, "Account with this email has already been verified! Please log in.");
  }

  // Find an email token associated with the user
  const token = await EmailToken.findOne({userId: user._id});

  /*
  - The existing token could be for verifying a user's current email or for 
    updating their email.
  */
  jwt.verify(token.token, process.env.EMAIL_TOKEN_SECRET!, (err: null | jwt.VerifyErrors, data: any) => {

    if (err) {
      return next(createError(500, "Error verifying an existing email token!"));
    }

    const jwtData: EmailTokenPayload = data;




  });

  



})



/**
 * Route used for verifying the initial email registered a user's account, or verifying the new email
 * that the user is changing to.
 * 
 * Route: '/verify-email/:token'
 * 
 * NOTE: 
 * 1. That there's also the possibility that the user has already deleted their account. This can happen when the 
 *    user gets sent a verification link and then immediately decide to delete their account. In that case the 
 *    token.userId.
 *
 * 2. If the user is verifying their current email, then updating their email won't do anything since its the same email, but if they're updating 
 *    their email then yes this update operation will mkae that change. Also if they're verifying their current email then isVerified will change
 *    from false to true, whilst in the case where they're email isVerified=true stays as isVerified=true.
 */
const verifyEmail = asyncHandler(async (req, res, next) => {

  // Token string
  const emailToken = req.params.token;

  jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECRET!, async (error: jwt.VerifyErrors | null, data) => {

    // Not a valid jwt token (bad form or expired)
    if (error) {
      return next(createError(400, "Bad or expired email verification link!"));
    }
    
    const tokenPayload = data as EmailTokenPayload;

    const token = await EmailToken.findOne({token: emailToken});
    if (!token) {
      return next(createError(400, "Link has already been used! Please request a new email verification link!"));
    }

    // Get user associated with the token; accounts for the case when the user deleted their account
    const user = await User.findById(token.userId);
    if (!user) {
      return next(createError(400, "Email verification failed, account being updated not found!"));
    }

    /*
    - If email in the token is different from the user's current email, it means they're updating their email and are verifying it. So do one final
      check to confirm that their new email hasn't been registered by any other accounts.
    - Else: User is verifying their current email, so no check needed
    */
    if (user.email !== tokenPayload.email) {
      const existingUser = await User.findOne({ email: tokenPayload.email });
      if (existingUser) {
        return next(createError(400, "This email has already been registered with another account!"));
      }
    }

    // Update the user's email and verification status
    user.email = tokenPayload.email;
    user.isVerified = true;
    await user.save();

    // Delete used token from the database
    await EmailToken.deleteOne({token: emailToken});
    res.status(200).json({message: `The email '${tokenPayload.email}' was successfully verified. Feel free to login now!`});
  });
})


/**
 * Function for logging out a user
 */
const logoutUser = async (req: Request, res: Response) => {
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
    sameSite: "none",
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
}

export {
  refresh,
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail  
}