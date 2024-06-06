import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { createError } from "./errorUtils";
import { IUserDoc } from "../types/User";
import { RequestUser, EmailTokenPayload } from "../types/Request";
import {Request, Response, NextFunction} from "express";


/**
 * Function to create access token for a user.
 * 
 * @param {Object} user - A user object 
 * @returns {string} The access token
 */
function generateAccessToken(user: IUserDoc): string {

  // Payload of the JWT; we'll set this as req.user later
  const payload: RequestUser = {
    id: user.id,
    role: user.role
  }
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15min" });
}

/**
 * Function to create the refresh token for a user.
 * 
 * @param {Object} user - A user object.
 * @returns {string} The refresh token
 */
function generateRefreshToken(user: IUserDoc): string {
	return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "1d" });
}


/**
 * Creates a jwt token with the email that we're trying to make the 
 * user verify.
 * 
 * NOTE: 
 * 1. Expiration should match the token database's expiration time. 
 * 2. You may see that we don't have a userId associated with the token. This is because
 * we're using a database, so we'll store the token string with the userId in the database, 
 * which is how we're able to link the user who wanted to verify an email, to the email that 
 * they want to verify.
 * 
 * 3. You may also be thinking 'collision rates' could be a concern if email is the only thing 
 * going into the payload. Collisions will not happen. Let's say you have an email 'IceCream43@gmail.com'.
 * The only times email tokens are created are when a user signs up and a verification email is sent, a user 
 * with an unverified email requests to be resent a verification link, and when a user wants to update to a 
 * new email.
 *    Case 1: User signup will be prevented when they signup with an already registered email
 *    Case 2: If you already have 'IceCream43@gmail.com', no other users will have that email, so no
 *            other users will be able to request to be resent a verification link for that email.
 *    Case 3: The update operation will be stopped to tell the user an account already exists with 
 *            the new email they specified. This stops the operation before the creation of the email token.
 */
function generateEmailToken(email: string): string {
  const payload: EmailTokenPayload = {
    email: email
  }

  return jwt.sign(payload, process.env.EMAIL_TOKEN_SECRET!, { expiresIn: "1h" });  
}

/**
 * Generates an email verification link
 * 
 * @param token - The unique string or property .token on every EmailToken
 * @returns Returns a link to the front-end's email-verification page. When the user loads up the 
 * page, the page will use the 'token' string and make a GET 'verify-email/:token' request to our 
 * backend.
 */
function generateVerifyEmailURL(token: string) {
  return `${process.env.CLIENT_URL}/verify-email/${token}`;
}


/**
 * Function to create the refresh token for a user.
 * 
 * @param {Object} res - A response object.
 * @param {string} refreshToken - The refresh token
 */
function setRefreshTokenCookie(res: Response, refreshToken: string) {
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
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  });
}

/**
 * Checks whether a request has a jwt token. If so let the request go on to the next middleware, 
 * else stop the request from going any further. This will be used to protect api routes.
 * 
 */
const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  /*
  1. Check capitalized and uncapitalized version. Since there's no standard, it's just better
    to check both.
  2. If authHeader is defined, we extract the token since authHeader = "Bearer <access_token>".
  This means if authHeader is null, then token is null. If the token is null return error to our
  error handling function.
  */
  const authHeader = req.headers.authorization || req.headers.Authorization;  
  const token = authHeader && (authHeader.toString().split(" ")[1]);

  if (!token) {
    const err = createError(401, "Unauthorized, you need to have an access token!");
    return next(err);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, user) => {
    if (err) {
      const newError = createError(401, "Unauthorized, access token you gave is invalid!");
      /*
      - Typically we can use 'throw' to give the error to the error handling middleware.
        But here we have to use next so that the error gets sent to the error handling middleware 
        rather than stopping our app. The reason for this is jwt.verify doesn't support throwing 
        errors in a way that can be caught by asyncHandler.
      */
      return next(newError);
    }

    /*
    - Set the user property on the request object to represent the 
      user that's currently making the request
    
    - NOTE: We know that the jwt payload will be defined since it's 
    an error wasn't caught when verifying the JWT? 
    As well as this we know 
    */
    req.user = user as RequestUser;
    next();
  })
})


export {
  generateEmailToken,
  generateVerifyEmailURL,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  verifyJWT
}
