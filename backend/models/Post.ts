import mongoose, {Types} from "mongoose";
import createSlug from "../middleware/createSlug";
import Tag from "../models/Tag";
import {post_status_map} from "../config/post_status_map";
import {findDocByID} from "../middleware/dbUtils";
import {createError } from "../middleware/errorUtils";
import Category from "../models/Category";
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

/**
 * Verifies whether a title and its generated slug are both unique and haven't 
 * been taken by another post yet.
 * 
 */
postSchema.statics.checkTitleAndSlug = async function(title: string, slug: string, id: string | null = null) {
  /*
  - Find a post with same title (case insensitive) or slug
  - If post exists, generate a corresponding error message, and throw back a status code 400, which
    will propagate to our route handler.

  - NOTE: We'll type it as any, since it's a filter object we can add onto if we wanted.
  */
  const basePostQuery: any = {$or: [
    {title: { $regex: new RegExp('^' + title + '$', 'i') }}, 
    {slug}
  ]}

  /*
  - If id is defined, we're checking we'll ensure the post we're looking for 
    can't have the ID specified. This is useful when updating posts, and excluding the 
    current post from the collection being queried.
  */
  if (id) {
    basePostQuery._id = {$ne: id};
  }

  const existingPost = await this.findOne(basePostQuery);
  if (existingPost) {
    let errMessage = "";
    if (existingPost.title.toLowerCase() === title.toLowerCase()) {
      errMessage = "Title is already taken by another post!";
    } else {
      errMessage = `Slug generated for post is already taken '${existingPost.slug}'. Please make title more different!`;
    }
    const err = createError(400, errMessage);
    throw err;
  }
}

/**
 * Verify that categoryID is a valid ID. If not, then throw back an error
 * that higlights the 'category' field as the issue.
 * 
 * @param {string} categoryID - String representing a potential id for a category
 */
postSchema.statics.checkCategory = async function(categoryID: string) {
  const category = await findDocByID(Category, categoryID);
  if (!category) {
    const err = createError(404, `Category with ID '${categoryID}' not found!`);
    throw err;
  }
}

/**
 * Checks if IDs in tagIDs are existing IDs in the tags collection.
 * 
 * @param {array} tagIDs - Array of strings that may be valid tag IDs
 * 
 */
postSchema.statics.checkTags = async function(tagIDs: string[]) {
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

/**
 * Handles creating a new post in the database.
 * 
 * @param {string} title - Title of the post 
 * @param {string} body - Html string representing the body of hte post 
 * @param {string} categoryID - String representing the ID of the category associated with the post
 * @param {string} tagIDs - Array of string that represent tag IDs
 * @param {string} imgSrc - String representing the source of the post's display image
 * @param {string} imgCredits - Credits for the display image
 * @param {string} status - Status of the post
 * @param {int} wordCount - Amount of words in the post's body
 * @param {string} userID - Id of the user who created the post
 * @returns {object} post - Newly created post document
 */
postSchema.statics.createPost = async function(title, body, categoryID, tagIDs=[], imgSrc, imgCredits, status, wordCount, userID) {
  // Create slug for post, now do a database check on the title and slug of the post
  const slug = createSlug(title);

  await this.checkTitleAndSlug(title, slug);

  // Check the category ID sent for the post to see if it's valid.
  await this.checkCategory(categoryID);

  /*
  - Check the validity of the tags. However only do this when there are tags
    to check.

  - NOTE: tagIDs could be null when calling this from our createPost route hander.
    So we make a default array an empty array, so in the case null is passed (no tags on post), tagIDs 
    is overwritten as an empty array, so that doing tagIDs.length doesn't raise any errors.
  */
  if (tagIDs.length > 0) {
    await this.checkTags(tagIDs);
  }

  // Finally If all checks are passed you can use save the new post to the database
  const post = await this.create({
    user: userID,
    title,
    slug,
    body,
    isPublished: status === post_status_map.published ? true : false, 
    category: categoryID,
    tags: tagIDs, 
    imgSrc,
    imgCredits,
    status,
    wordCount,
  })
  
  // Return the post so that we can return it as later in our controller.
  return post;
}

/**
 * Instance method for applying updates to an existing post in the database.
 * 
 * @param {string} title - Title of the post 
 * @param {string} body - Html string representing the body of hte post 
 * @param {string} categoryID - String representing the ID of the category associated with the post
 * @param {string} tagIDs - Array of string that represent tag IDs
 * @param {string} imgSrc - String representing the source of the post's display image
 * @param {string} imgCredits - Credits for the display image
 * @param {string} status - Status of the post
 * @param {int} wordCount - Amount of words in the post's body
 * @param {string} userID - ID of the user who is updating the post
 */
postSchema.methods.updatePost = async function(title: string, body: string, categoryID: string, tagIDs: string[], imgSrc: string, imgCredits: string, status: string, wordCount: number, userID: string) {
  /*
  - As per our business rules, we want every post to have a unique title.
  1. If the title has changed, check the title and slug for duplication. We will
    pass the current post's id to exclude it from the search, saying "Find any OTHER post that has the same title or slug as the current post, if 
      none, then that's good because that means even with the title change it's still unique".

  - NOTE: A slug can stay the same even if the title changes. For example 'Zelda' and 'zelda!'
    generate the same slug, but are different titles. If this happens, we want to avoid throwing 
    an error due to duplicate slug, when the found post and current post being updated are the same.
    So we pass in the current post's id to the checkTitleAndSlug function.
  */
  const slug = createSlug(title);
  if (this.title.toLowerCase() !== title.toLowerCase()) {
    await Post.checkTitleAndSlug(title, slug, this._id);
  }

  /*
  - If the category is different, do a database check to ensure the category
    ID entered is linked to an existing category.
  - NOTE: this.category is still an ObjectId so it must be converted into a 
    string first. 
  */
  if (this.category.toString() !== categoryID) {
    await Post.checkCategory(categoryID);
  } 

  /*
  - Now check the validity of array of tag IDs. The idea is that we would 
    only need to check any new tag IDs, because any tag IDs already included
    in the post have already been validated and are ensured to be in the database.
  1. Get the list of post tag IDs 
  2. Find the tags that aren't yet on the post; if there are new tags, run them
     through our function that checks if they're in the database.
  3. If it hasn't thrown an error, those new tags are valid, so we can 
    reassign the tags array to 'tagIDs'.
  */
  const postTagIDs = this.tags.map((tagID: Types.ObjectId) => tagID.toString());
  const newTagIDs = tagIDs.filter(tagID => !postTagIDs.includes(tagID));
  if (newTagIDs.length > 0) {
    await Post.checkTags(newTagIDs);
  }
  
  // At this point data has passed the database checks, so update the post instance
  this.title = title;
  this.body = body;
  this.slug = slug;
  this.category = categoryID;
  this.tags = tagIDs;
  this.imgSrc = imgSrc,
  this.imgCredits = imgCredits;
  this.wordCount = wordCount;
  
  // By updating the status, we could change whether or not the post is published or not
  // This will also save the changes to the object 
  this.updateStatus(status, userID);
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
