const rateLimit = require("express-rate-limit");
const postLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 15,
  handler: (req, res, next, options) => {
    const err = Error(`Too many requests for posts, categories, and or tags. Please try again in ${options.windowMs / 1000} seconds`);
    err.statusCode = 429 // Status code to indicate 'Too many requests'
    next(err); 
  }
})

module.exports = postLimiter;