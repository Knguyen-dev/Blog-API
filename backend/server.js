require("dotenv").config();

const createError = reuqire("");
const logger = require("morgan");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");

const express = require("express");
const app = express();

connectToDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes

// Catch all route for our api
app.use(function (req, res, next) {
	const error = new Error("404 Endpoint Not Found");
	error.statusCode = 404;
	next(error);
});

/*
+ Error handler


1. If the statusCode propert ywasn't dfeined, it was a programming or 
  database error. It was something we couldn't control within our controllers, and
  so it is unexpected. We'll use default status code and error message to indicate
  that it was something on our end rather than the client's. The reason that 
  we're replacing the error message is becasue with a programming or database 
  error, it's likely going to be not understandable for the average user.


*/
app.use(function (err, req, res, next) {
	if (!err.statusCode) {
		err.statusCode = 500;
		err.message = "Something went wrong. Please try again later!";
	}

	// Return the error as json
	res.status(err.statusCode).json({ status: "error", message: err.message });
});
