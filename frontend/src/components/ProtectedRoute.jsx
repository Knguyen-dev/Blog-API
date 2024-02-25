import { useLocation, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/user/useAuthContext";
import PropTypes from "prop-types";

/*
+ ProtectedRoute: Component we use to wrap around our routes to protect them.
  At minimum this makes it so a user has to be authenticated before being able 
  to go to those routes. Then with our 'allowedRoles' array, even if they are 
  authenticated, we can choose which roles are able to access that route!

- allowedRoles: An array of roles. By default if nothing is passed, then it becomes 
  an empty array.

*/

export default function ProtectedRoute({ allowedRoles = [], children }) {
	const { auth } = useAuthContext();
	const location = useLocation();

	// If the user isn't authenticated, then redirect them.
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
  - If there are no roles, then this route isn't protected by roles, so 
    they are authorized. Or, if the user's role is 
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

ProtectedRoute.propTypes = {
	allowedRoles: PropTypes.array,
	children: PropTypes.element,
};
