import asyncHandler from "express-async-handler";
import {postValidators} from "../middleware/validators/postValidators";
import { canViewPost } from "../middleware/permissions/postPerms";
import { handleValidationErrors } from "../middleware/errorUtils";
import postServices from "../services/post.services";
import { convertQueryParamToArray } from "../middleware/queryUtils";



/**
 * Middleware for creating new post
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
    
    // Attempt to create a post
    const post = await postServices.createPost(
      req.body.title,
      req.body.body,
      req.body.category,
      req.body.tags,
      req.body.imgSrc,
      req.body.imgCredits,
      req.body.status,
      req.body.wordCount,
      // req.user will be defined since this middleware comes after verifyJWT middlewar.
      req.user!.id
    );

    // Finally send back the created post as json
    res.status(200).json(post);
  })
]

/**
 * Middleware for creating updating an existing post
 * 
 * NOTE: A user can only edit their own post, and this permission logic is 
 * embedded in the updatePost service function itself.
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

    // Attempt to update a post
    const post = await postServices.updatePost(
      req.params.id,
      req.body.title,
      req.body.body,
      req.body.category,
      req.body.tags,
      req.body.imgSrc,
      req.body.imgCredits,
      req.body.status,
      req.body.wordCount,
      // req.user will be defined since verifyJWT middleware comes before this
      req.user!.id,
    )
    
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
    
    // Attempt to update the post
    const post = await postServices.updatePostStatus(
      req.params.id, 
      req.body.status, 
      // verifyJWT middleware guarantees that req.user is defined
      req.user!.id
    );

    // Return the newly updated post
    res.status(200).json(post);
  })
];

/**
 * Middleware for deleting an existing post.
 * 
 * NOTE: A user can only edit their own post.
 */
const deletePost = asyncHandler(async(req, res) => {

  // Attempt to delete the post; if unsuccesful an error would be thrown 
  const result = await postServices.deletePost(
    req.params.id, 
    // req.user should be defined due to this coming after after verifyJWT middleware
    req.user!.id, 
    req.user!.role
  );

  // Return the result of the operation, which would be a success
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
  const posts = await postServices.getAllPosts();
  res.status(200).json(posts);
})

const getPostsByUser = asyncHandler(async(req, res) => {

  // Verify whether the user making the request is allowed to view the post
  canViewPost(req.user!.id, req.user!.role, req.params.id);

  const posts = await postServices.getPostsByUser(req.params.id);
  res.status(200).json(posts);
})

/**
 * Returns published posts, posts that can be seen by users
 * 
 */
const getPublishedPosts = asyncHandler(async(req, res) => {  
  const titleArr = convertQueryParamToArray(req.query.title);
  const categoryArr = convertQueryParamToArray(req.query.category);
  const tagArr = convertQueryParamToArray(req.query.tags);

  const posts = await postServices.getPublishedPosts(titleArr, categoryArr, tagArr);

  res.status(200).json(posts);
})

/**
 * Gets the details of a post. Good for getting details to edit a post
 * 
 */
const getPostByID = asyncHandler(async(req, res) => {

  // Attempt to find a post by ID; and populate fields 'user', 'category', and 'tags' 
  const post = await postServices.findPostByID(req.params.id, "user category tags");

  // Verify whether the user can view this particular post; if not we'll throw an error and stop tihs response  
  canViewPost(req.user!.id, req.user!.role, post.user._id.toString());

  // Return the post
  res.status(200).json(post);
})


/**
 * Get a published post via its slug
 * 
 */
const getPublishedPostBySlug = asyncHandler(async(req, res) => {
  // Attempt to find post with matching slug and is published
  const post = await postServices.getPublishedPostBySlug(req.params.slug);
  res.status(200).json(post);
})


export {
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  getPosts,
  getPostsByUser,
  getPublishedPosts,
  getPostByID,
  getPublishedPostBySlug
}