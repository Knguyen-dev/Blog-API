import {Request, Response, NextFunction} from "express";


/**
 * Middleware that sets the 'Acess-Control-Allow-Credentials' header to 'true' for requests
 * that are from origins that are whitelisted. As a result credentials such as cookies, authorization headers,
 * and other things can be sent in cross-origin requests. 
 *  
 * NOTE: When testing this function, we use dependency injection, which just means we pass in the 
 * allowedOrigins, rather than importing it from a file. As a result, in our real server.js 
 * file we put our origins we want for production, whilst in testing we can put our origins for 
 * our tests. This keeps them separate, and so if the production origins change, they won't affect 
 * the tests since the tests are isolated.
 */
const verifyCredentials = (allowedOrigins: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    /*
    - If origin is defined, then see if it's included in our allowed origins list.
      If included, allow credentials, else we don't allow.
    - Else, origin is not defined, so we don't allow.
    */
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
  }
}

export default verifyCredentials;
