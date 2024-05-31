import mongoose from "mongoose";
import { createError } from "../middleware/errorUtils";
import {ITag, ITagModel} from "../types/Tag";

const tagSchema = new mongoose.Schema<ITag, ITagModel>({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },

  // Slug will be the other attribute that uniquely identifies a tag
  slug: {
    type: String,
    required: true,
    unique: true
  },

  // User who last updated the tag; could be the creator or maybe an admin?
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

/**
 * 
 * @param tagIDs - An array of id values that we're checking to see if they all reference
 * an existing tag document in the database
 */
tagSchema.statics.checkTags = async function(tagIDs: string[]) {
  /*
  + Check for any invalid tags.
  1. Get all tags in database. Get an array of their IDs, ensure that they are strings because
    we will compare them.
  2. Iterate through each tagID in the given list, and check if it's included. If it is, then 
    it's a valid tagID in the database, else it isn't so throw an error.
  */
  const existingTags = await Tag.find();
  const existingTagIDs = existingTags.map(tagObj => tagObj._id.toString());
  tagIDs.forEach(tagID => {
    if (!existingTagIDs.includes(tagID)) {
      const err = createError(404, `Tag with ID ${tagID} not found!`)
      throw err; 
    }
  });
}


tagSchema.methods.toJSON = function() {
  const tagObj= this.toObject();
  delete tagObj.__v;
  delete tagObj.lastUpdatedBy;
  return tagObj;
}


const Tag = mongoose.model<ITag, ITagModel>("Tag", tagSchema);
export default Tag;


