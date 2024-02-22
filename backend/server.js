require("dotenv").config();

const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const connectDB = require("./config/database");
const corsOption = require("./config/corsOption");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT")

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public"))); // serve static assets such as our stored images on disk
app.use(credentials); // credentials/cookies configuration
app.use(cors(corsOption)); // cors configuration
app.use(logger("dev")); // logs out requests in the console
app.use(express.json());  // json from request body
app.use(express.urlencoded({ extended: true })); // json from forms
app.use(cookieParser()); // let's us access cookies from request object



// Public routes
app.use("/auth", authRouter);

// Api (protected) routes
// app.use(verifyJWT);
app.use("/users", userRouter);


// Catch all route for our api
app.use(function (req, res, next) {
	const error = new Error("404 Endpoint Not Found");
	error.statusCode = 404;
	next(error);
});

/*
+ Error handler
1. If the statusCode property wasn't defined, it was a programming or 
  database error. It was something we couldn't control within our controllers, and
  so it is unexpected. We'll use default status code and error message to indicate
  that it was something on our end rather than the client's. The reason that 
  we're replacing the error message is becasue with a programming or database 
  error, it's likely going to be not understandable for the average user.
*/
app.use(function (err, req, res, next) {

  console.log(err);

  if (!err.statusCode) {
    err.statusCode = 500
    err.message = "Server Error!"
  }

	// Return the error as json
	res.status(err.statusCode).json({ message: err.message });
});


// Connect to database and start server
connectDB();
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  })
})