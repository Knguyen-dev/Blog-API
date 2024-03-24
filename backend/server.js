require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const employeeRouter = require("./routes/employeeRouter");
const categoryRouter = require("./routes/categoryRouter");
const tagRouter = require("./routes/tagRouter");
const postRouter = require("./routes/postRouter");

const connectDB = require("./config/database");
const corsOption = require("./config/corsOption");
const credentials = require("./middleware/credentials");
const allowedOrigins = require("./config/allowedOrigins");
const verifyJWT = require("./middleware/verifyJWT")




const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public"))); // serve static assets such as our stored images on disk
app.use(credentials(allowedOrigins)); // credentials/cookies configuration
app.use(cors(corsOption)); // cors configuration
app.use(logger("dev")); // logs out requests in the console
app.use(express.json());  // json from request body
app.use(express.urlencoded({ extended: true })); // json from forms
app.use(cookieParser()); // let's us access cookies from request object



// Public routes
app.use("/auth", authRouter);

// Api (protected) routes
app.use(verifyJWT);
app.use("/users", userRouter);
app.use("/employees", employeeRouter);
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

  
  res.status(err.statusCode).json({
    error: {
        status: err.statusCode,
        message: err.message
      }
  });
  
});


// Connect to database and start server
connectDB();
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  })
})