const mongoose = require("mongoose");
const queryUtils = require("../middleware/queryUtils");

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
    unique: true,
  }
}, {
  timestamps: true
})

tagSchema.statics.findTagByID = queryUtils.findDocumentByID;

module.exports = mongoose.model("Tag", tagSchema);