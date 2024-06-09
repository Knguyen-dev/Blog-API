import { createError } from "../errorUtils"; // function for creating custom errors
import { Request, Response, NextFunction } from "express";

/**
 * Creates a rate limit handler middleware that generates a custom error message
 * when the rate limit is exceeded.
 * 
 * @param errorMessage The message to include in the error response.
 * @returns A middleware function that handles rate limit exceeded errors.
 */
const createRateLimitHandler = (errorMessage: string) => {
  return (req: Request, res: Response, next: NextFunction) => {

    // Get the reset time from the request; this returns a date object 
    const resetTime = (req as any).rateLimit.resetTime; 

    // Calculate remaining time until the rate limit window rests
    const remainingTimeMs = resetTime - Date.now();
    const remainingTimeMin = Math.ceil(remainingTimeMs / 60000)
    
    // Create a custom error with the remaining time included in the message
    const err = createError(429, `${errorMessage} Please wait ${remainingTimeMin} minutes(s)!`);
    next(err);
  };
}

export default createRateLimitHandler;