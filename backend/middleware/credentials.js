const allowedOrigins = require("../config/allowedOrigins");

/*
- Middleware that allows the accessing of cookies (credentials)
  by the server if it's an origin that's on our allowed list.
  So we're essentially indicating the browser that our server allows 
  cookies to be sent.
*/

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
}

module.exports = credentials;