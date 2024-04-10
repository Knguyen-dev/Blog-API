const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const postValidators = require("../middleware/validators/postValidators");
const {createError, handleValidationErrors } = require("../middleware/errorUtils");
const {findDocByID} = require("../middleware/dbUtils");
/**
 * Middleware for creating new post
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: As well as this, a user is only allowed to create a post for themselves. 
 * Users can't create posts, and pass it off like another user created them.
 */
const createPost = [
  postValidators.title,
  postValidators.body,
  postValidators.category,
  postValidators.tags,
  postValidators.imgSrc,
  postValidators.imgCredits,
  postValidators.status,
  postValidators.wordCount,
  handleValidationErrors, 
  asyncHandler(async(req, res, next) => {   
    
    // Attempt to create a new post
    const post = await Post.createPost(
      req.body.title,
      req.body.body,
      req.body.category,
      req.body.tags,
      req.body.imgSrc,
      req.body.imgCredits,
      req.body.status,
      req.body.wordCount,
      req.user.id
    );

    // Finally send back the created post as json
    res.status(200).json(post);
  })
]

/**
 * Middleware for creating updating an existing post
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: A user can only edit their own post.
 */
const updatePost = [
  postValidators.title,
  postValidators.body,
  postValidators.category,
  postValidators.tags,
  postValidators.imgSrc,
  postValidators.imgCredits,
  postValidators.status,
  postValidators.wordCount,
  handleValidationErrors, 
  asyncHandler(async(req, res, next) => {

    // attempt to find the post; verify it exists
    const post = await findDocByID(Post, req.params.id);
    if (!post) {
      const err = createError(404, "Post not found!")
      return next(err);
    }

    // check if the requestor is the author of the post; if not then don't allow them to update it
    if (post.user.toString() !== req.user.id) {
      const err = createError(403, "Cannot update this post because you are not the owner of this post!");
      return next(err);
    } 
    
    // Update the post and return the updated post as json
    await post.updatePost(
      req.body.title,
      req.body.body,
      req.body.category,
      req.body.tags,
      req.body.imgSrc,
      req.body.imgCredits,
      req.body.status,
      req.body.wordCount,
    )

    res.status(200).json(post);
  })
]

/**
 * Middleware for deleting an existing post.
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 * 
 * NOTE: A user can only edit their own post.
 */
const deletePost = asyncHandler(async(req, res, next) => {
  // Checks for the existence of the post, if not, this throws error

  const post = await findDocByID(Post, req.params.id);
  if (!post) {
    const err = createError(404, "Post wasn't found!");
    return next(err);
  }

  // Post exists so delete the post; send back result as json to indicate a success
  const result = await Post.findByIdAndDelete(req.params.id);
  res.status(200).json(result);
})

/**
 * Get all of the posts in the database
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getPosts = asyncHandler(async(req, res) => {
  const posts = await Post.find().populate("user category");
  res.status(200).json(posts);
})


/**
 * Get all of the posts in the database
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getPost = asyncHandler(async(req, res, next) => {
  // Attempt to find Post by ID; ensure to populate the 'user', 'category', and 'tags' fields 
  const post = await findDocByID(Post, req.params.id, ['user', 'category' , 'tags']);
  if (!post) {
    const err = createError(404, "Post wasn't found!");    
    return next(err);
  }
  
  res.status(200).json(post);
})

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost
}