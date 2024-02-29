const rateLimit = require("express-rate-limit");


/*
+ Limiter for employee signup attempts. We've made this less restrictive than
  the regular user signup becasue maybe an administrator may want to be 
  able to create more employee accounts. Admins should be able to have more 
  power, but we also don't expect them to abuse this.

*/
const signupLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 second window
  max: 10, 
  handler: (req, res, next, options) => {
    const err = Error(`Too many employee signup attempts. Try again after ${options.windowMs / 1000} seconds!`);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err);
  }
})

module.exports = {
  signupLimiter
}