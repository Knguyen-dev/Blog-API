const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const postValidators = require("../middleware/validators/postValidators");
const handleValidationErrors = require("../middleware/handleValidationErrors");

/*
+ Creating a post 

- NOTE: Only editors and admins are allowed to access this endpoint and create 
  posts. As well as this, a user is only allowed to create a post for themselves. 
  Users can't create posts, and pass it off like another user created them.

1. Potential change would be just checking the slug instead of checking the title
  The slug itself is more important than the title really.

2. Need to add front-end validation for title, body, etc.
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

/*
+ Update an existing post.

- NOTE: Only the author of the original post is able to use this particular 
  route. However, admins should be able to update the 'status' property 
  of all posts. I don't think we need to check the 'existence' of the user 
  here because we may make it so if a user deletes their account, all of their 
  posts are deleted, or we make them not associated with a user.
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







/*
+ Delete a post
- NOTE: Implement the rule that editors can only delete their own posts, whilst 
  admins have the ability to delete anyone's post. So create 'postPerms' middleware
  to do that.
*/
const deletePost = asyncHandler(async(req, res) => {
  // Checks for the existence of the post, if not, this throws error
  await Post.findPostByID(req.params.id);

  // Post exists so delete the post; send back result as json to indicate a success
  const result = await Post.findByIdAndDelete(req.params.id);
  res.status(200).json(result);
})


const getPosts = asyncHandler(async(req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
})


/*
+ Return surface level information about a post
*/
const getPost = asyncHandler(async(req, res) => {
  // Attempt to find Post by ID; ensure to populate the 'user', 'category', and 'tags' fields 
  const post = await Post.findPostByID(req.params.id, ['user', 'category' , 'tags']);
  res.status(200).json(post);
})


/*
+ Return detailed information about a post.
*/




module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost
}