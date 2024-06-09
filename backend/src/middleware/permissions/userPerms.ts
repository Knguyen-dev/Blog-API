import {createError} from "../errorUtils";
import {Request, Response, NextFunction} from "express";

/**
 * Checks if requester is authorized to modify a user account. A user can be modified
 * when the ID of the requestor matches the ID of the 
 * user being edited (indicates that a user is updating their own account).
 * 
 * NOTE: Of the exception to this is the employee router, where admins can admin 
 * certain attributes of users that are marked as employees.
 */
function canModifyUser(req: Request, res: Response, next: NextFunction) {
  // If req.user is undefined, stop the request
  if (!req.user) {
    const err = createError(401, "Unauthorized, user has to be authenticated first!");
    return next(err);
  }

  // For the user router, users can only modify their own accounts
  if (req.user.id !== req.params.id) {
    const err = createError(401, "Unauthorized to modify said user!");
    return next(err);
  } 
  next();
}


export {
  canModifyUser
}
