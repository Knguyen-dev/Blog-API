import rateLimit from "express-rate-limit";
import { createError } from "../errorUtils";



/**
 * Middleware to limit sign up attempts
 */
export const signupLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 5, 
  handler: (req, res, next, options) => {
    const err = createError(429, `Too many signup attempts. Try again after ${options.windowMs / 1000} seconds!`);
    next(err);
  }
})

/**
 * Middleware for limiting login attempts
 * 
 */
export const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 5, // maximum number of request during said window
  handler: (req, res, next, options) => {
    const err = createError(429, `Too many login attempts. Try again after ${options.windowMs / 1000} seconds!`);
    next(err);
  }
})

