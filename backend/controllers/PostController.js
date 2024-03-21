const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const postValidators = require("../middleware/validators/postValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");

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
  asyncHandler(async(req, res) => {   
    
    /*
    - Check existence of the currently logged in user. Want to ensure the user 
      that's wanting to create a post still exists.
    */
    await User.findUserByID(req.user.id);

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
  asyncHandler(async(req, res) => {

    /*
    - Find the post by ID and ensure the user making the request is the owner 
      of the post. As a result we're ensuring that only the author of the post 
      can 'edit' the content of the post.
    */
    const post = await Post.findPostByID(req.params.id);
    if (post.user.toString() !== req.user.id) {
      const err = new Error("Cannot update this post because you are not the owner of this post!");
      err.statusCode = 403;
      throw err;
    } 
    
    // At this point update the post
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

    // Return updated post as json
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
const deletePost = asyncHandler(async(req, res) => {
  // Checks for the existence of the post, if not, this throws error
  await Post.findPostByID(req.params.id);

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
  const posts = await Post.find();
  res.status(200).json(posts);
})


/**
 * Get all of the posts in the database
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getPost = asyncHandler(async(req, res) => {
  // Attempt to find Post by ID; ensure to populate the 'user', 'category', and 'tags' fields 
  const post = await Post.findPostByID(req.params.id, ['user', 'category' , 'tags']);
  res.status(200).json(post);
})

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost
}