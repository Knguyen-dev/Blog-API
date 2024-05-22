import connectDB from "./config/database";
import mongoose from "mongoose";
import app from "./app";

  // Connect to database and start server
connectDB();
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  })
})