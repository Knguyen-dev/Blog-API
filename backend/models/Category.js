const mongoose = require("mongoose");
const queryUtils = require("../middleware/queryUtils");
const categorySchema = new mongoose.Schema({
  /*
  - For the 'title' we won't lowercase it. Categories should be easy to handle
    since there aren't as many of them so if there's a duplicate title, 
    we can easily edit or delete the title.
  */
  title: {
    type: String,
    required: true,
    maxLength: 100,
    unique: true,
  },

  
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },

  slug: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  }
})

// Finds categories by ID.
categorySchema.statics.findCategoryByID = queryUtils.findDocumentByID;


module.exports = mongoose.model("Category", categorySchema, "Categories");
