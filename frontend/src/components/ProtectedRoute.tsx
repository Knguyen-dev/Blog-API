import { useLocation, Navigate } from "react-router-dom";
import useAuthContext from "../../../frontend/src/hooks/useAuthContext";
import { ReactNode } from "react";

/*
+ ProtectedRoute: Component we use to wrap around our routes to protect them.
  At minimum this makes it so a user has to be authenticated before being able 
  to go to those routes. Then with our 'allowedRoles' array, even if they are 
  authenticated, we can choose which roles are able to access that route!
*/

interface ProtectedRouteProps {
  allowedRoles?: string[]; // An array of roles. By default if nothing is passed, then it becomes an empty array.
  children: ReactNode;
}

export default function ProtectedRoute({
  allowedRoles = [],
  children,
}: ProtectedRouteProps) {
  const { auth } = useAuthContext();
  const location = useLocation();

  // If the user isn't authenticated, then redirect them to the login page.
  if (!auth.user) {
    return (
      <Navigate
        to="/auth/login"
        replace={true}
        state={{ from: location.pathname }}
      />
    );
  }

  /*
  - If there are no roles, then this route isn't protected by roles (user just has to be logged in, no specific 
    roles required), so  they are authorized. Or, if the user's role is 
    included in the allowedRoles list, then they are also authorized.

  - NOTE: So isAuthorized will be true if either of these conditions are true. And
    it will be false if both conditions are false. Also we convert all roles 
    to integers
  */
  const isAuthorized =
    allowedRoles.length === 0 ||
    allowedRoles.map((role) => parseInt(role)).includes(auth.user.role);
  return isAuthorized ? children : <Navigate to="/unauthorized" />;
}
