import {roles_map} from "../../config/roles_map";
import {createError} from "../errorUtils";
import {Request, Response, NextFunction} from "express";

/**
 * Checks if requester is authorized to modify a user account. A user can be modified
 * when they're an admin or if the ID of the requestor matches the ID of the 
 * user being edited (indicates that a user is updating their own account).
 * 
 */
function canModifyUser(req: Request, res: Response, next: NextFunction) {
  // If req.user is undefined, stop the request
  if (!req.user) {
    const err = createError(401, "Unauthorized, user has to be authenticated first!");
    return next(err);
  }

  // If they aren't an admin, and the IDs don't match (they aren't editing themselves ), then stop the request
  if (req.user.role !== roles_map.admin && req.user.id !== req.params.id) {
    const err = createError(401, "Unauthorized to modify said user!");
    return next(err);
  } 
  next();
}


export {
  canModifyUser
}
