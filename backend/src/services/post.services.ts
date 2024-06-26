import { createError } from "../middleware/errorUtils";
import createSlug from "../middleware/createSlug";
import categoryServices from "./category.services";
import Post from "../models/Post";
import Tag from "../models/Tag";

import { post_status_map } from "../config/post_status_map";
import { Types, isValidObjectId } from "mongoose";
import { canUpdatePost, canDeletePost } from "../middleware/permissions/postPerms";

/**
 * Finds a post with its ID
 * 
 * @param id - String that may or may not be the objectId of a document
 * @param populateOptions 
 */
const findPostByID = async (id: string, populateOptions: string = "") => {
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid Post ID");
  }
  const post = await Post.findById(id).populate(populateOptions);
  if (!post) {
    throw createError(404, "Post not found");
  }
  return post;
}

/**
 * Attempts to create a post
 * 
 * @param title - Title of the post 
 * @param body - Html string representing the body content of the post
 * @param categoryID - Id of the category associated with the post 
 * @param tagIds - Array of Id values for the tags associated with the post 
 * @param imgSrc - The URL string that'll link to the image/thumbnail for the post 
 * @param imgCredits - Credits for the image
 * @param status - The status of the post
 * @param wordCount - Number of words on the post
 * @param userId - User who created the post (the author)
 */
const createPost = async (title: string, body: string, categoryID: string, tagIDs: string[], imgSrc: string, imgCredits: string, status: string, wordCount: number, userId: string) => {

  // Compute the slug
  const slug = createSlug(title);

  /**
   * Attempt to find any posts that already have this slug. If so 
   * we'll throw back an error since slugs should be unique.
   */
  const existingPost = await Post.findOne({slug: slug});
  if (existingPost) {
    throw createError(400, `The title entered creates a URL-friendly name that already exists for the post "${existingPost.title}". Please use a different title to make it unique.`);
  }

  // Ensure that the categoryID is associated with an existing category
  await categoryServices.findCategoryByID(categoryID);

  // If there are tags, then ensure the tagIDs are valid and link to existing tags
  if (tagIDs.length > 0) {
    await Tag.checkTags(tagIDs);
  }

  // Create and save the post in the database
  const post = await Post.create({
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
    user: userId,
  });

  // return the saved post
  return post;
}

/**
 * Updates a post
 * 
 * @param id - Id of the post being updated
 * @param title - new title for the post 
 * @param body - new body for the post 
 * @param categoryID - id of the category associated with the post 
 * @param tagIDs - List of ids of the tags associated with the post
 * @param imgSrc - Source of the post's thumbnail and image
 * @param imgCredits - Credits to said iamge
 * @param status - Status of the post
 * @param wordCount - Number of words on the post
 * @param userID - Id of the user who is updating the post
 */
const updatePost = async (id: string, title: string, body: string, categoryID: string, tagIDs: string[], imgSrc: string, imgCredits: string, status: string, wordCount: number, userID: string) => {

  // Attempt to find the post givne the id
  const post = await findPostByID(id);

  // Verify whether the user has permissions to update this post
  canUpdatePost(userID, post.user.toString());

  /*
  - If slug generated by new title is different from the slug in the current title, then we
  need to check if the new slug is unique.
  */
  const slug = createSlug(title);
  if (post.slug !== slug) {
    const existingPost = await Post.findOne({slug: slug});
    if (existingPost) {
      throw createError(400, `Title creates a url-friendly name that already exists for post titled ${existingPost.title}. Please make the title more unique!`);
    }
  }

  /*
  - If the category is different, do a database check to ensure the category
    ID entered is linked to an existing category. 

  - NOTE: 
    Using categoryServices, if the function throws an error, that means it 
    caught an issue with the categoryID and so the updatePost service 
    function stops immediately and throws an error to be caught in a route handler

    Also posts.category could be undefined when there is no category on the post 
    due to the category being deleted.
  */
  if (post.category?.toString() !== categoryID) {
    await categoryServices.findCategoryByID(categoryID);
  }


  /*
  - Now check the validity of array of tag IDs. The idea is that we would 
    only need to check any new tag IDs, because any tag IDs already included
    in the post have already been validated and are ensured to be in the database.
  1. currentTagIds: Get a list of the id values of the tags current on the post.
  2. newTagIds: Get a list of id values from our 'tagIds' parameter, that aren't 
    included in 'currentTagIds'. These represent the tagIds that aren't on the post yet,
    and so need to be checked to see if they are valid.
  3. If there are any new tags, check that they are valid tags in the database.
  */
  const currentTagIDs = post.tags.map((tagID: Types.ObjectId) => tagID.toString());
  const newTagIDs = tagIDs.filter(tagID => !currentTagIDs.includes(tagID));
  if (newTagIDs.length > 0) {
    await Tag.checkTags(newTagIDs);
  }

  post.title = title;
  post.body = body;
  post.slug = slug;
  post.category = new Types.ObjectId(categoryID);
  post.tags = tagIDs.map(tagID => new Types.ObjectId(tagID));
  post.imgSrc = imgSrc,
  post.imgCredits = imgCredits;
  post.wordCount = wordCount;

  // Update the status of the post; also updates isPublished and lastUpdatedBy
  post.updateStatus(status, userID);

  // Save the the changes to the post
  await post.save();

  return post;
}

/**
 * Handles updating only the status of a post
 * 
 * @param id - id of the post being updated
 * @param status - new status of the post
 * @param userID - id of the user that's updating the post
 */
const updatePostStatus = async (id: string, status: string, userID: string) => {
  const post = await findPostByID(id, "user category tags");
  post.updateStatus(status, userID);
  await post.save();

  return post;
}

/**
 * Handles deleting a post and checking if the user has the permissions to delete
 * a post.
 * 
 * @param id - Id of the post being updated
 * @param userID - ID of the user who is deleting the post
 * @param role - Role of the user who is deleting the post
 */
const deletePost = async(id: string, userID: string, role: number) => {
  
  // Attempt to find the post via its ID
  const post = await findPostByID(id);

  // Check whether or not the user has permissions to delete a post
  canDeletePost(userID, role, post.user.toString());

  // Delete the post 
  const result = await Post.deleteOne({_id: id});

  // Return the result of our delete operation
  return result;
}


const getAllPosts = async() => {
  const posts = await Post.find().populate("user category tags");
  return posts;
}


/**
 * Handles getting published posts, given 
 * 
 * @param title - Title that we want to match
 * @param categoryIDs - A list of id values for categories that we want for our posts. For example
 *                      if categoryIDs = [id1, id2], then we want to look for posts with a category
 *                      that has an id of 'id1' or 'id2'.
 * @param tagIDs - Same idea as categoryIDs. So if we have tagIds = [id1, id2, id3], then for any given post 
 *                 if that post at least one of these tags, then we'll return it.
 */
const getPublishedPosts = async(titles?: string[], categoryIDs?: string[], tagIDs?: string[]) => {
  const baseQuery: any = {isPublished: true};

  // IF there's a title
  if (titles) {
    const titleRegex = new RegExp(titles.join("|"), "i");
    baseQuery.title = titleRegex;
  }

  // If categories are specified
  if (categoryIDs) {
    // Check whether each id in the categoryIDs is valid; ensures the query doesn't return an error
    for (const categoryID of categoryIDs) {
      if (!isValidObjectId(categoryID)) { 
        return createError(400, "Invalid category ID!")
      }
    }
    
    // Category ids are valid, so include them
    baseQuery.category = {
      $in: categoryIDs
    }
  }

  // If there are tags we want to filter with
  if (tagIDs) {
    // Validate each tag in the array
    for (const tagID of tagIDs) {
      if (!isValidObjectId(tagID)) {
        throw createError(400, `Invalid tag ID: ${tagID}`);
      }
    }
    // Add valid tags to the query
    baseQuery.tags = { $in: tagIDs };
  }

  const posts = await Post.find(baseQuery).populate("tags user category");
  
  return posts;
}

/**
 * Gets all of the posts related to a user
 * 
 * @param id - Id of the user that we want posts from
 */
const getPostsByUser = async (id: string) => {
  
  // Ensure that the userID is valid
  if (!isValidObjectId(id)) {
    throw createError(400, "User id isn't valid!");
  }
  
  // Attempt to find posts and return them
  const posts = await Post.find({user: id}).populate("user tags category");
  return posts;
}


const getPostBySlug = async (slug: string, isPublished?: boolean) => {
  const postQuery: any = {
    slug: slug
  }
  if (isPublished !== undefined) {
    postQuery.isPublished = isPublished;
  }

  const post = await Post.findOne(postQuery).populate("user category tags");
  if (!post) {
    throw createError(404, "Post not found!");  
  }
  return post;
}

/**
 * Gets a published post with its slug
 */
const getPublishedPostBySlug = async (slug: string) => {
  const post = await Post.findOne({slug: slug, isPublished: true}).populate("user category tags");
  if (!post) {
    throw createError(404, "Post not found!");  
  }
  return post;
}


const postServices = {
  findPostByID,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  getAllPosts,
  getPublishedPosts,
  getPostsByUser,
  getPostBySlug,
  getPublishedPostBySlug
};

export default postServices;