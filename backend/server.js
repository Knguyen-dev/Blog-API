require("dotenv").config();
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");


const express = require("express");
const app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // the origins allowed to access your express backend
  credentials: true, // Accept credentials (cookies) sent by the client
}))

// Routes
app.use("/auth", authRouter);
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

  console.log(err.message);
	if (!err.statusCode) {
		err.statusCode = 500;
		err.message = "Something went wrong. Please try again later!";
	}

	// Return the error as json
	res.status(err.statusCode).json({ message: err.message });
});



// Connect to database and then start listening for requests.
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  })
}).catch((err) => {
  console.log("Couldn't connect to db: ", err)
}) 
