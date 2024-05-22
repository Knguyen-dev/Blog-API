import { roles_map } from "../config/roles_map";
import { createError } from "./errorUtils";
import {Request, Response, NextFunction} from "express";


/**
 * A higher-order function that creates middleware functions to protect routes based on the allowed roles.
 * 
 *  Returns a middleware function that checks if the user's role is included in the allowedRoles array. 
 *  If the user's role is included, the middleware allows the request to proceed; otherwise, it returns a 401 Unauthorized response.
 */
const verifyRoles = (...allowedRoles: number[]) => {

  return (req: Request, res: Response, next: NextFunction) => {

    // Ensure there is a logged in user.
    if (!req.user) {
      const err = createError(401, "Unauthorized, user has to be authenticated first!")
      return next(err);
    }

    /*
    - If the user's role is not included in the allow list ,then
      we won't let them access the resource. Send back a 401 error.
    */
    if (!allowedRoles.includes(req.user.role)) {
      const err = createError(401, "Unauthorized to access this resource!");
      return next(err);
    }

    // They're authorized at this point so go to the next middleware.
    next();
  }
}


const verifyAdmin = verifyRoles(roles_map.admin);
const verifyEditorOrAdmin = verifyRoles(roles_map.editor, roles_map.admin);

export {
  verifyRoles,
  verifyAdmin,
  verifyEditorOrAdmin,
}
