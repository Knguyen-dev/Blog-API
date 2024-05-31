import mongoose from "mongoose";
import {post_status_map} from "../config/post_status_map";
import { IPost, IPostModel } from "../types/Post";

const postSchema = new mongoose.Schema<IPost, IPostModel>(
	{
    // User who created the post; the author of the post
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},

    // Title of a post; you could also think about this like an article
		title: {
			type: String,
			require: true,
			maxLength: 100,
		},

    // Slug for the post
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },

    // Body of the post, representing the main content of it; an html string
    body: {
			type: String,
			required: true,
		},

    // Boolean indicating whether or not it's published and being shown on the site
		isPublished: {
			type: Boolean,
			default: false,
		},

    // The broad category that the post is in.
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    
    // The array of tags IDs associated with the post; optional
    tags: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tag"
      }
    ],

    // Source to the post's thumbnail or display image
    imgSrc: {
      type: String,
      required: true,
    },

    // The credits for that display image
    imgCredits: {
      type: String,
      required: true,
    },

    // String representing the status of the post
    status: {
      type: String,
      enum: Object.keys(post_status_map),
      default: post_status_map.draft,
      lowercase: true,
      required: true,
    },

    // Amount of words in the body of the post 
    wordCount: {
      type: Number,
      required: true,
    },

    /*
    - ID of the user who last updated this. This is needed because the user who
      last updated a post could be the author themselves, or an admin.
    */
    lastUpdatedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    }

	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	}
);

postSchema.methods.toJSON = function() {
  const postObj = this.toObject();
  delete postObj.__v;
  delete postObj.lastUpdatedBy;
  return postObj;
}
/**
 * Updates the status of a post
 * 
 * @param {string} status - New status of the post
 * @param {string} userID - ID of the user who is updating the post
 */
postSchema.methods.updateStatus = function(status: string, userID: string) {
  this.status = status;
  if (status === post_status_map.published) {
    this.isPublished = true;
  } else {
    this.isPublished = false;
  }
  this.lastUpdatedBy = userID;
}

const Post = mongoose.model<IPost, IPostModel>("Post", postSchema);
export default Post;
