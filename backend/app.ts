import dotenv from "dotenv";
dotenv.config();

import path from "path";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import employeeRouter from "./routes/employeeRouter";
import categoryRouter from "./routes/categoryRouter";
import tagRouter from "./routes/tagRouter";
import postRouter from "./routes/postRouter";

import express from "express";
import corsOption from "./config/corsOption";
import verifyCredentials from "./middleware/verifyCredentials";
import allowedOrigins from "./config/allowedOrigins";

import { createError } from "./middleware/errorUtils";
import { jsonifyError } from "./middleware/errorUtils";
import { postLimiter } from "./middleware/limiters/postLimiter";
import CustomError from "./config/CustomError";

const app = express();

app.use(express.static(path.join(__dirname, "public"))); // serve static assets such as our stored images on disk
app.use(verifyCredentials(allowedOrigins)); // credentials/cookies configuration
app.use(cors(corsOption)); // cors configuration
app.use(logger("dev")); // logs out requests in the console
app.use(express.json());  // json from request body
app.use(express.urlencoded({ extended: true })); // json from forms
app.use(cookieParser()); // let's us access cookies from request object

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/employees", employeeRouter);


app.use(postLimiter); // limiter for posts, categories, and tags
app.use("/categories", categoryRouter);
app.use('/tags', tagRouter);
app.use("/posts", postRouter);


// Catch all route for our api
app.use(function (req, res, next) {
  const error = createError(404, "404 Endpoint Not Found");
  next(error);
});


// Error handler
app.use(function (err: Error | CustomError, req: Request, res: Response, next: NextFunction) {
  
  console.log("Error: ", err.message)
  /*
  - Errors that are thrown can be CustomErrors (errors that we expect and have thrown manually), or builtin/native errors (unexpected errors).

  
  - If the error is a CustomError
  1. Then we can pass it to the jsonifyError function since it accepts CustomError errors.
  2. Then return the json.

  - Else 'err' is not a CustomError
  1. If the error isn't a CustomError, we shall create a custom error to represent a server error 
  2. An unexpected error would have an error message that we can't control, and probably would leak sensitive/non-readable
    information about our system to the client. In these cases we replace the error message to 'Server Error!'. As well as 
    this, every CustomError has an appropriate status code associated with it. So in this case for our new CustomError, we'd 
    put status 500, because it's an unexpected error or server error on our end.
  */
  if (err instanceof CustomError) {
    const errJson = jsonifyError(err);
    res.status(err.statusCode).json(errJson);
  } else {
    const serverErr = createError(500, "Server Error!");
    const errJson = jsonifyError(serverErr);
    res.status(serverErr.statusCode).json(errJson);
  }
});


export default app;