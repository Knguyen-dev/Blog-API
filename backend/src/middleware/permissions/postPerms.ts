import {roles_map} from "../../config/roles_map";
import {createError} from "../errorUtils";

/**
 * Verifies whether or not a user can update a post. In this case, a user making a request
 * can only update a post in its entirety, when they are also the author of the post
 * @param userId - Id of the user making the request
 * @param postUserId - Id of the user who is associated with the post; the author of the post
 */
function canUpdatePost(userId: string, postUserId: string) {
  if (userId !== postUserId) {
    throw createError(403, "Cannot update post since you didn't create this post!");
  } 
}

/**
 * Verifies whether or not a user can delete a post
 * 
 * User is only able to delete a post when they are the that created the post 
 * OR if they're an admin.
 * 
 * If user didn't the author of the post AND they aren't an admin, then they
 * won't be able to delete the post.
 * 
 * @param userId - Id of the user making the request
 * @param userRole - Role of the user making the request
 * @param postUserId - Id of the user associated with the post;
 */
function canDeletePost(userId: string, userRole: number, postUserId: string) {
  if (postUserId !== userId && userRole !== roles_map.admin) {
    throw createError(403, "Cannot delete post since you don't have the authority!"); 
  }
}

/**
 * Verifies whether or not the user is authorized to view a post.
 *  
 * NOTE: This is useful for a route such as '/posts/:id' (getPostByID) which allows a user 
 * to view any post in the database, not just published posts. 
 * @param userId - Id of the user that's making the request to view the post
 * @param userRole - Role of the user that's making the request to view the post 
 * @param postUserId - Id of the user associated with the post
 */
function canViewPost(userId: string, userRole: number, postUserId: string) {
  /*
  - If the user is looking at their own post, or they're an admin, then we'll allow the post 
    data to be sent back. As a result this allows users to only be able to view their own 
    posts if they're editors, or if they're admins they can view anyone's post 
  
  - Conditional: If it's not their own post, and they aren't an admin, then they aren't allowed
  */
  if (userId !== postUserId && userRole !== roles_map.admin) {
    throw createError(401, "Not authorized to view this post!");
  }
}

export {
  canUpdatePost,
  canDeletePost,
  canViewPost
}