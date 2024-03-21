const rateLimit = require("express-rate-limit");



/**
 * Middleware to limit sign up attempts
 */
const signupLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 5, 
  handler: (req, res, next, options) => {
    const err = Error(`Too many signup attempts. Try again after ${options.windowMs / 1000} seconds!`);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err);
  }
})

/**
 * Middleware for limiting login attempts
 * 
 */
const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 5, // maximum number of request during said window
  handler: (req, res, next, options) => {
    const err = Error(`Too many login attempts. Try again after ${options.windowMs / 1000} seconds!`);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err);
  }
})

module.exports = {signupLimiter, loginLimiter};