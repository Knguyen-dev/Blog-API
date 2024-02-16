const allowedOrigins = require("./allowedOrigins");

/*
- Cors middleware: Define an 'origin' function which allows cors
  to handle logic pertaining to the origins of requests. Cors will provide
  the 'callback' function. 

- If origin of request is included in allowedOrigins, or origin isn't defined 
  which usually happens for same-origin requests. Then we run callback, which 
  is provided by CORS, with null and true which indicates to CORS middleware that 
  we will allow the request.

- Else: It's a cross-origin request from we origin that we didn't put in
  our allowedOrigins. We pass an error in the callback to indicate to CORS to 
  reject the request. As a result, this should throw an error which will be 
  caught by our error handling middleware.

- optionsSuccessStatus: For successful OPTIONS requests, set to 200.
  So OPTIONS request is just the preflight request to check if the server is going
  to allow the request. In the case of a successful preflight we respond back
  with a status code 200.
*/

const corsOption = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      const err = Error("Not allowed by CORS");
      err.statusCode = 403;
      callback(err);
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOption