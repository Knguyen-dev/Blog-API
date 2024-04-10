const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  // Title of the category
  title: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
  },

  // Description of the category
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },

  // Slug we generated for the category
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

categorySchema.methods.toJSON = function() {
  const categoryObj = this.toObject();
  delete categoryObj.createdAt;
  delete categoryObj.updatedAt;
  delete categoryObj.__v;
  return categoryObj;
}

module.exports = mongoose.model("Category", categorySchema, "Categories");
