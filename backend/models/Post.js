const mongoose = require("mongoose");
const slugify = require("slugify");
const queryUtils = require("../middleware/queryUtils");
const Category = require('../models/Category');
const {Tag} = require("../models/Tag");
const ValidationError = require("../errors/ValidationError");
const post_status_map = require("../config/post_status_map");

const postSchema = new mongoose.Schema(
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
      unique: true,
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
    imgSrc: String,

    // The credits for that display image
    imgCredits: String,

    // String representing the status of the post
    status: {
      type: String,
      enum: Object.keys(post_status_map),
      default: "draft",
      lowercase: true,
    },

    // Amount of words in the body of the post 
    wordCount: {
      type: Number,
      required: true,
    }

	},
	{
		toJSON: { virtuals: true },
		timestamps: true,
	}
);


postSchema.statics.findPostByID = queryUtils.findDocumentByID;



/**
 * Verifies whether a title and its generated slug are both unique and haven't 
 * been taken by another post yet.
 * 
 * @param {string} title - Title of the post 
 * @param {string} slug - Slug generated based on the title
 */
postSchema.statics.checkTitleAndSlug = async function(title, slug) {
  /*
  - Find a post with same title (case insensitive) or slug
  - If post exists, generate a corresponding error message, and throw back a status code 400
    with a ValidationError, which gives us a error details object when sending back our json error.
  */
  const existingPost = await this.findOne({$or: [
    {title: { $regex: new RegExp('^' + title + '$', 'i') }}, 
    {slug}
  ]});
  if (existingPost) {
    let errMessage = "";
    if (existingPost.title.toLowerCase() === title.toLowerCase()) {
      errMessage = "Title is already taken by another post!";
    } else {
      errMessage = `Slug generated for post is already taken '${existingPost.slug}'. Please make title more different!`;
    }

    const err = new ValidationError("title", errMessage, 400);
    throw err;
  }
}

/**
 * Verify that categoryID is a valid ID. If not, then throw back a ValidationError 
 * that higlights the 'category' field as the issue.
 * 
 * @param {string} categoryID - String representing a potential id for a category
 */
postSchema.statics.checkCategory = async function(categoryID) {

  const err = ValidationError("category", "", 400);

  // Check if valid mongoose object id 
  if (!mongoose.Types.ObjectId.isValid(categoryID)) {
    err.message = "Invalid category ID!";
    throw err;
  }

  // Get category and check whether or not it was found
  const category = await Category.findById(categoryID);
  if (!category) {
    err.message = `Category with ID '${categoryID}' not found!`
    throw err;
  }
}



/**
 * Checks if IDs in tagIDs are existing IDs in the tags collection
 * 
 * @param {array} tagIDs - Array of strings that may be valid tag IDs
 * 
 * NOTE: Similar with checkCategory, 404 is accurate but doesn't convey the proper
 * idea that the 'tags' that were in the request body were invalid. Then we raise 
 * an error and indicate the 'tags' property, in the request body was the 'field'
 * that had an issue.
 */
postSchema.statics.checkTags = async function(tagIDs) {
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
      const err = ValidationError("tags", `Tag with ID ${tagID} doesn't exist!`, 400);
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
  const slug = slugify(title, {
    lower: true, 
    replacement: "-",
    strict: true,
    trim: true, 
  });
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
 */
postSchema.methods.updatePost = async function(title, body, categoryID, tagIDs, imgSrc, imgCredits, status, wordCount) {

  // If new title is different from the current one, do a database check on the title and slug
  const slug = slugify(title, {
    lower: true, 
    replacement: "-",
    strict: true,
    trim: true, 
  });
  if (this.title.toLowerCase() !== title.toLowerCase()) {
    await this.constructor.checkTitleAndSlug(title, slug);
  }

  /*
  - If the category is different, do a database check to ensure the category
    ID entered is linked to an existing category.

  - NOTE: this.category is still an ObjectId so it must be converted into a 
    string first. 
  */
  if (this.category.toString() !== categoryID) {
    await this.constructor.checkCategory(categoryID);
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
  const postTagIDs = this.tags.map(tagID => tagID.toString());
  const newTagIDs = tagIDs.filter(tagID => !postTagIDs.includes(tagID));
  if (newTagIDs.length > 0) {
    await this.constructor.checkTags(newTagIDs);
  }
  
  // At this point data has passed the database checks, so update the post instance
  this.title = title;
  this.body = body;
  this.slug = slug;
  this.category = categoryID;
  this.tags = tagIDs;
  this.imgSrc = imgSrc,
  this.imgCredits = imgCredits;

  // By updating the status, we could change whether or not the post is published or not
  this.status = status;
  if (status === post_status_map.published) {
    this.isPublished = true;
  } else {
    this.isPublished = false;
  }

  this.wordCount = wordCount;

  // Save changes
  await this.save();
}

module.exports = mongoose.model("Post", postSchema);
