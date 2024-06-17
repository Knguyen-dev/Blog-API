import dotenv from "dotenv";
dotenv.config();


import { connectRedis } from "./config/redis";
import connectDB from "./config/database";
import app from "./app";

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // NOTE: Redis errors are handled inside the connectRedis function, so even if 
    // there's something wrong with Redis, app will still be functional!
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