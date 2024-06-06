import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database";
import User from "../models/User";
import Tag from "../models/Tag";




async function main() {
  try {
    await connectDB();
    const users = await User.find();
    for (const user of users) {
      user.isVerified = false;
      await user.save();
    }
  } catch (err: any) {
    console.log("Error inserting user: ", err.message);
  }
}
main();