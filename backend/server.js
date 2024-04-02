const connectDB = require("./config/database");
const mongoose = require("mongoose");
const app = require("./app");

  // Connect to database and start server
connectDB();
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  })
})