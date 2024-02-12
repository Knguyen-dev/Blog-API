const rateLimit = require("express-rate-limit");

/*
+ loginLimiter: Will be used to restrict the amount of requests from the same IP.
  So we'll plan that a computer can only make 10 login requests every 30 seconds.


*/


const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10, 
  message: "Too many login attempts. Try again after 30 seconds!",
  handler: (req, res, next, options) => {
    const err = Error(options.message);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err);
  }
})

module.exports = loginLimiter;