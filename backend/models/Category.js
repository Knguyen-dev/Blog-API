const mongoose = require("mongoose");
const queryUtils = require("../middleware/queryUtils");
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
  }
})

// Finds categories by ID.
categorySchema.statics.findCategoryByID = queryUtils.findDocumentByID;
categorySchema.methods.toJSON = function() {
  const categoryObj = this.toObject();
  delete categoryObj.createdAt;
  delete categoryObj.updatedAt;
  delete categoryObj.__v;
  return categoryObj;
}

module.exports = mongoose.model("Category", categorySchema, "Categories");
