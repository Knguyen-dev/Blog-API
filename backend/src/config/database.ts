import mongoose from "mongoose";

export default async function connectDB() {
  try {
    // Connect to mongoose; use a non-null operator to assure TypeScript that this will be defined on run
    // since we're accessing it from a dotenv file.
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.error(err);
  }
}
