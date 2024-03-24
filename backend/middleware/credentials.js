// const allowedOrigins = require("../config/allowedOrigins");


/**
 * Middleware that sets the 'Acess-Control-Allow-Credentials' header to 'true' for requests
 * that are from origins that are whitelisted. As a result credentials such as cookies, authorization headers,
 * and other things can be sent in cross-origin requests. 
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {function} next - Function to go to the next middleware function
 * @param {string[]} allowedOrigins - Array of allowed origins that we want to set credentials for
 * 
 * NOTE: When testing this function, we use dependency injection, which just means we pass in the 
 * allowedOrigins, rather than importing it from a file. As a result, in our real server.js 
 * file we put our origins we want for production, whilst in testing we can put our origins for 
 * our tests. This keeps them separate, and so if the production origins change, they won't affect 
 * the tests since the tests are isolated.
 */
const credentials = (req, res, next, allowedOrigins) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
}

module.exports = credentials;