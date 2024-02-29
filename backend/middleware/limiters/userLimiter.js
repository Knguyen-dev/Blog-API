const rateLimit = require("express-rate-limit");

const editUserLimiter = rateLimit({
  windowMs: 60 * 1000, // A minute window,
  max: 20, // maximum of 20 requests per minute
  handler: (req, res, next, options) => {
    const err = Error(`Too many account editing attempts. Please try again in ${options.windowMs / 1000} seconds`);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err);
  }
})


module.exports = {editUserLimiter};