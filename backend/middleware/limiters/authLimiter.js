const rateLimit = require("express-rate-limit");

/*
+ loginLimiter: Will be used to restrict the amount of requests from the same IP.
  So in a 30 second window, we'll only allow 5 requests from the same IP.


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