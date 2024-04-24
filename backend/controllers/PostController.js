const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const roles_map = require("../config/roles_map");
const postValidators = require("../middleware/validators/postValidators");
const {createError, handleValidationErrors } = require("../middleware/errorUtils");
const {findDocByID, isValidObjectId} = require("../middleware/dbUtils");
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

    /*
    - Can only update an existing post in its entirety if they
      are the user who created the post.
    */
    if (post.user.toString() !== req.user.id) {
      const err = createError(403, "Cannot update post since you didn't create this post!");
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
      req.user.id,
    );

    res.status(200).json(post);
  })
]

/**
 * Route used for specifically updating the status of a post. 
 * 
 * NOTE: Admins can only edit their own post, but they can't edit someone else's 
 * post, at least not in its entirety e.g. changing the title, body, categories, etc.
 * However to give admins at least some control we'll allow them to be able to
 * change the status of a post. This maintains our rule of only having the 
 * creator/author of the post to be able to mess with its contents, whilst 
 * giving admins at least some control in our system.
 * 
 * We'll make sure only admins are able to get to this route, because if 
 * anyone can access this route, then an editor would be able to change the 
 * status of another user's post.
 */
const updatePostStatus = [
  postValidators.status,
  handleValidationErrors,
  asyncHandler(async(req, res, next) => {
    
    // Try to find the post that the admin is trying to update
    const post = await findDocByID(Post, req.params.id, ["user category"]);
    if (!post) {
      const err = createError(404, "Post being updated was not found!");
      return next(err);
    }

    // Update the status of the post
    await post.updateStatus(req.body.status, req.user.id);
    
    // Return the newly updated post
    res.status(200).json(post);
  })
];

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

  /*
  - User is only able to delete a post when they are the one that created the post
    OR they're an admin.
  */
  if (post.user.toString() !== req.user.id && req.user.role === roles_map.admin) {
      const err = createError(403, "Cannot delete post since you don't have the authority!");
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
 * 
 * NOTE: It'd be great of the populate() function followed the toJSON rule 
 * I set in my userSchema. Because right now it returns user with the password (the hash)
 * and other unnecessary data. 
 * 
 * NOTE: You may use this for 'admin' as well since it gets all posts. 
 */
const getPosts = asyncHandler(async(req, res) => {
  const posts = await Post.find().populate("user category");

  res.status(200).json(posts);
})

/**
 * Returns the posts created by a given user
 * 
 * route: /users/:id/posts
 *  
 * NOTE: It's not uncommon to create a post controller like this and then use it 
 * in our userRouter. As long as things make sense in your application, in this case posts are closely
 * related to users, then it's good. As long as we prioritize maintainability and making sure things 
 * are easy to change and fix.
 * 
 */
const getPostsByUser = asyncHandler(async(req, res, next) => {

  // verify that ID is a valid object id, don't need to do findDocByID since we don't need the user itself
  if (!isValidObjectId(req.params.id)) {
    const err = createError("404", "User wasn't found!");
    return next(err);
  }

  /*
  - Valid id, so attempt to find all posts linked to that ID. Populate 
    the 'user' and 'category' fields as that can be used to display card info on the frontend.
  */
  const posts = await Post.find({
    user: req.params.id
  }).populate("user category");


  return res.status(200).json(posts);
})

/**
 * Gets the details of a post
 * 
 * @param (express.Request) req - The request object
 * @param (express.Response) res - The response object
 */
const getPostDetails = asyncHandler(async(req, res, next) => {
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
  updatePostStatus,
  deletePost,
  getPosts,
  getPostsByUser,
  getPostDetails
}