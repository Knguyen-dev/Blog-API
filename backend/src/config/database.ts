import mongoose from "mongoose";

/**
 * Function that connects to the MongoDB database via Mongoose
 */
export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.error(err);
  }
}
