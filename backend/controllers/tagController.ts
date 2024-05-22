import asyncHandler from "express-async-handler";
import tagValidators from "../middleware/validators/tagValidators";
import { handleValidationErrors } from "../middleware/errorUtils";
import { convertQueryParamToArray } from "../middleware/queryUtils";
import tagServices from "../services/tag.services";


/**
 * Creates a new tag
 */
const createTag = [
  tagValidators.title,
  handleValidationErrors,
  asyncHandler(async(req, res) => {

    // Attempt to create tag; req.user is defined due to verifyJWT middleware
    const tag = await tagServices.createTag(req.body.title, req.user!.id);

    // Return the successfully created tag
    res.status(200).json(tag);
})]

/**
 * Deletes an existing tag
 *  
 */
const deleteTag = [
  asyncHandler(async(req, res) => {

    // Delete the tag and get the result
    const result = await tagServices.deleteTag(req.params.id);
    res.status(200).json(result);
  })
]

/**
 * Updates an existing tag 
 * 
 */
const updateTag = [
  tagValidators.title,
  handleValidationErrors,
  asyncHandler(async(req, res) => {
    const tag = await tagServices.updateTag(
      req.params.id, 
      req.body.title, 
      // req.user is guaranteed to be defined due to the verifyJWT middleware
      req.user!.id
    );
    res.status(200).json(tag);
  }
)]

/**
 * Get all existing tags
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getTags = asyncHandler(async(req, res) => {

  // Get all tags from the database
  const tags = await tagServices.getTags();
  res.status(200).json(tags);
})

/**
 * Gets the tag and posts that have that tag
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: When using await Promise.all for a concurrency, we need to ensure that 
 * req.params.id is a valid object id. While dbUtils.findDocByID checks it, Post.find does
 * not, so to avoid throwing a cast error. Also despite this using 'req.params.id'
 * we don't use setTag because we want to keep the concurrent query.
 */
const getTagAndPosts = asyncHandler(async(req, res) => {

  // Fetch the tag and posts
  const {tag, posts} = await tagServices.getTagAndPosts(req.params.id)

  // Return the tag, and posts associated with the tag
  res.status(200).json({tag, posts});
})

const getTagAndPublishedPosts = asyncHandler(async(req, res) => {


  // Convert the title query parameter into an array
  const titleArray = convertQueryParamToArray(req.query.title);

  // Get the tag and published post associated with said tag
  const {tag, posts} = await tagServices.getTagAndPosts(req.params.id, {
    publishedOnly: true,
    titles: titleArray
  });

  // Return the tag, and posts associated with the tag
  res.status(200).json({tag, posts});
})

export {
  createTag,
  deleteTag,
  updateTag,
  getTags,
  getTagAndPosts,
  getTagAndPublishedPosts
}