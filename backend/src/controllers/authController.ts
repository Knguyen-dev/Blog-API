import User from "../models/User";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userValidators from "../middleware/validators/userValidators";
import {body} from "express-validator";
import { createError, handleValidationErrors } from "../middleware/errorUtils";
import {generateAccessToken, setRefreshTokenCookie} from "../middleware/tokenUtils";
import { generatePasswordResetUrl, generatePasswordHash } from "../middleware/passwordUtils";
import sendForgotPasswordEmail from "../services/email/sendForgotPassword";
import {Request, Response, NextFunction} from "express";
import authServices from "../services/auth.services";
import employeeCache from "../services/caches/EmployeeCache";


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
    
    // Attempt to signup the user
    const user = await authServices.signupUser(email, username, password, fullName);

    // Return the signed up user
    res.status(200).json(user);
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

    // Check if username and password link to a user in the database
    const user = await authServices.loginUser(req.body.username, req.body.password);

    // Generate an access token
		const accessToken = generateAccessToken(user);
    
    /*
    - Set the refresh token as a cookie in the response header.
    - NOTE: Since the loginUser service successfully finished, it would have 
      assigned a refreshToken to the user, so we can guarantee and assert that
      user.refreshToken is defined at this point in time.
    */
    setRefreshTokenCookie(res, user.refreshToken!);


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

/**
 * Sends a password reset email to the user
 */
const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    throw createError(404, "An account wasn't found with the given email!");
  }

  // Save password reset token in the database, and return plain-text version here
  const resetToken = user.createPasswordResetToken();
  await user.save();
  
  const resetUrl = generatePasswordResetUrl(resetToken);

  try {
    await sendForgotPasswordEmail(user.email, user.fullName, resetUrl);
  } catch (err) {
    // If there was an error sending the email, clear the password reset token 
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    throw err;
  }

  res.status(200).json({message: `Password reset link sent to email '${user.email}'! Link will be valid for 15 minutes!`});
})

const resetPassword = [
  userValidators.password,
  userValidators.confirmPassword,
  handleValidationErrors,
  
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    // Create the reset token hash from a plain-text token route parameter
    const resetTokenHash = crypto.createHash("sha256").update(req.params.passwordResetToken).digest("hex");
    /*
    - Find a user with that token hash, and the passwordResetTokenExpires field must have a 
    value greater than now (token isn't expired). 
    */
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetTokenExpires: {$gt: Date.now()}
    })
    if (!user) {
      throw createError(404, "Password reset link is invalid or has expired!");
    }

    // User was found and token is valid, update the password with the hashed version of it 
    user.password = await generatePasswordHash(req.body.password);

    /*
    - Delete the password reset token, but delete any refresh token that the user has. This is the idea of 
      logging the user out and ensuring that any refrehs token owned by maliicous actors can't be used anymore.
    */
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.refreshToken = undefined;


    await user.save();

    res.status(200).json({message: "Password reset was successful. Please log in!"})
  })
]



export {
  refresh,
  signupUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
}