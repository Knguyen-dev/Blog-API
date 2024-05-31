import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database";
import Tag from "../models/Tag";




async function main() {
  try {
    await connectDB();

    const tags = await Tag.find();

    
    
  } catch (err: any) {
    console.log("Error inserting user: ", err.message);
  }
}
main();