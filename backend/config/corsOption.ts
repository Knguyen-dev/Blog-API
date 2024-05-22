import allowedOrigins from "./allowedOrigins";
import {CorsOptions} from "cors";
import { createError } from "../middleware/errorUtils";

/*
- Cors middleware: Define an 'origin' function which allows cors
  to handle logic pertaining to the origins of requests. Cors will provide
  the 'callback' function. 

- If origin of request is included in allowedOrigins, or origin isn't defined (undefined) 
  which usually happens for same-origin requests. Then we run callback, which 
  is provided by CORS, with null and true which indicates to CORS middleware that 
  we will allow the request.

- NOTE: If origin is undefined (same-origin), the indexOf function would return -1, but since we have the OR operator 
  we can still allow same-origin requests. We simply do to eliminate typechecking errors

- Else: It's a cross-origin request from we origin that we didn't put in
  our allowedOrigins. We pass an error in the callback to indicate to CORS to 
  reject the request. As a result, this should throw an error which will be 
  caught by our error handling middleware.

- optionsSuccessStatus: For successful OPTIONS requests, set to 200.
  So OPTIONS request is just the preflight request to check if the server is going
  to allow the request. In the case of a successful preflight we respond back
  with a status code 200.
*/

const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if ((typeof origin === 'string' && allowedOrigins.indexOf(origin)) !== -1 || !origin) {
      callback(null, true)
    } else {
      const err = createError(403, "Request not allowed by CORS")
      callback(err);
    }
  },
  optionsSuccessStatus: 200
}

export default corsOption;