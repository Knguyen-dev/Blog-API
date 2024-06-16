import dotenv from "dotenv";
dotenv.config();


import { connectRedis } from "./services/caches/redis.services";
import connectDB from "./config/database";
import app from "./app";

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    await connectRedis();

    // Start the Express server
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    // Handle any errors
    console.error("Failed to connect:", err);
  }
};

startServer();
