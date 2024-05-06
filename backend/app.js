require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const employeeRouter = require("./routes/employeeRouter");
const categoryRouter = require("./routes/categoryRouter");
const tagRouter = require("./routes/tagRouter");
const postRouter = require("./routes/postRouter");

const express = require("express");
const corsOption = require("./config/corsOption");
const verifyCredentials = require("./middleware/verifyCredentials");
const allowedOrigins = require("./config/allowedOrigins");
const { jsonifyError } = require("./middleware/errorUtils");
const postLimiter = require("./middleware/limiters/postLimiter");

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
  const error = new Error("404 Endpoint Not Found");
  error.statusCode = 404;
  next(error);
});


// Error handler
app.use(function (err, req, res, next) {
  console.log("Error Caught: ", err.message);

  // If no status code, it's an unexpected error, so mark its status code and give it a general error message
  if (!err.statusCode) {
    err.statusCode = 500
    err.message = "Server Error!"
  }
  
  // With said error message, create the json format we're going to 
  // send it back in.
  const jsonError = jsonifyError(err);

  res.status(err.statusCode).json(jsonError);
});


module.exports = app;