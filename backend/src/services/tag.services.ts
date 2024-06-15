import { createError } from "../middleware/errorUtils";
import createSlug from "../middleware/createSlug";
import { isValidObjectId, Types } from "mongoose";
import Tag from "../models/Tag";
import Post from "../models/Post";


const findTagByID = async (id: string) => {
  // Check if the id is a valid objectId
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid tag ID");
  }

  const tag = await Tag.findById(id);
  if (!tag) {
    throw createError(404, "Tag not found!");
  }

  return tag;
}

/**
 * Create and return a tag
 * 
 * @param title - New title 
 * @param userId - Id of the user that's creating the tag
 */
const createTag = async(title: string, userId: string) => {
  
  // Create slug and check whether slug is unique
  const slug = createSlug(title);
  const existingTag = await Tag.findOne({ slug: slug});
  if (existingTag) {
    throw createError(400, `The title entered creates a URL-friendly name that already exists for the tag "${existingTag.title}". Please use a different title to make it unique.`);
  }

  // create tag in the database
  const tag = await Tag.create({
    title,
    slug,
    lastUpdatedBy: userId,
  })

  // Return tag
  return tag;
}

/**
 * Deletes a tag, removes tag from all posts, and then returns the deleted tag
 * 
 * @param id - Tag that's being deleted
 */
const deleteTag = async (id: string) => {
  // Check if the id is a valid objectId
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid tag ID");
  }

  // Id is good, so attempt to delete the tag
  const result = await Tag.deleteOne({_id: id});

  // If no tags were deleted, then the tag 
  if (result.deletedCount === 0) {
    throw createError(404, "Tag being deleted wasn't found!");
  }


  // Delete the tag in all posts associated with that tag
  await Post.updateMany(
    {
      // Get all posts with the tag's id in the tags array
      tags: id,
    },
    {
      $pull: {
        // Remove the deleted tag id from the tags array
        tags: id
      }
    }
  )

  // Return the result from deleting the tag
  return result;
}

/**
 * Attempts to update a tag
 * 
 * @param id - Id of the tag being updated
 * @param title - New title of the tag
 * @param userId - Id of the user who's updating the tag
 */
const updateTag = async (id: string, title: string, userId: string) => {

  // Attempt to find tag by its ID
  const tag = await findTagByID(id);

  // Compute a slug
  const slug = createSlug(title);

  /*
  - If the new slug is different from the current slug. Then we need to check if 
  this new slug isn't already taken by another tag in the database.
  */
  if (tag.slug !== slug) {
    const existingTag = await Tag.findOne({ slug: slug });
    if (existingTag) {
      throw createError(400, `The title entered creates a URL-friendly name that already exists for the tag "${existingTag.title}". Please use a different title to make it unique.`);
    }
  }

  tag.title = title;
  tag.slug = slug;
  tag.lastUpdatedBy = new Types.ObjectId(userId);

  await tag.save();

  return tag;
}

/**
 * Get all tags in the database 
 */
const getTags = async () => {
  const tags = await Tag.find();
  return tags;
}


/**
 * Fetches the tag details and associated posts based on various options.
 *
 * @param {string} id - The ID of the tag to fetch.
 * @param {Object} options - Additional options for fetching posts.
 * @param {boolean} [options.publishedOnly] - Whether to fetch only published posts.
 * @param {string[]} [options.titles] - An array of keywords to match against post titles. So we'll return a post 
 *                                      if it has one of these keywords somewhere in the title
 */
const getTagAndPosts = async (id: string, options: { publishedOnly?: boolean, titles?: string[] } = {}) => {
  
  // Check if category id is valid before moving on
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid tag ID");
  }

  // Create filter object for querying for posts associated with the tag
  const basePostQuery: any = {
    tags: id, 
  }

  // IF we have some configurations for the title of posts
  if (options.titles) {
    const titleRegex = new RegExp(options.titles.join('|'), "i"); // Match any title in the list
    basePostQuery.title = titleRegex;
  }

  // Check to see if we only want published posts
  if (options.publishedOnly) {
    basePostQuery.isPublished = true;
  }

  const [tag, posts] = await Promise.all([
    Tag.findById(id),
    Post.find(basePostQuery).populate("tags user category")
  ])

  // If tag wasn't found, throw an error
  if (!tag) {
    throw createError(404, "Tag not found!");
  }

  return {tag, posts};
}

const tagServices = {
  findTagByID,
  createTag,
  deleteTag,
  updateTag,
  getTags,
  getTagAndPosts
}

export default tagServices;