import mongoose from "mongoose";
import { ICategory, ICategoryModel } from "../types/Category";


const categorySchema = new mongoose.Schema<ICategory, ICategoryModel>({
  // Title of the category
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },

  // Description of the category
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },

  /*
  - Slug we generated for the category. Aside from the objectId, we want the slug
  to be able to uniquely identify a category.
  
  */
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },

  /*
  - Represents the user that had last updated/edited the category's information.

  - NOTE: When a category is first created, the user who created the Category
    will fill the lastUpdatedBy field with their ID.
  */
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

const Category = mongoose.model<ICategory, ICategoryModel>("Category", categorySchema, "Categories");
export default Category;