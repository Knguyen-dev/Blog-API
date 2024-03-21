const allowedOrigins = require("../config/allowedOrigins");


/**
 * Middleware that sets the 'Acess-Control-Allow-Credentials' header to 'true' for requests
 * that are from origins that are whitelisted. As a result credentials such as cookies, authorization headers,
 * and other things can be sent in cross-origin requests. 
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {function} next - Function to go to the next middleware function
 */
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
}

module.exports = credentials;