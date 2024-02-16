import { useLocation, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import PropTypes from "prop-types";

/*
allowedRoles: An array of roles

*/

export default function ProtectedRoute({ allowedRoles = [], children }) {
	const { auth } = useAuthContext();
	const location = useLocation();

	// If the user isn't authenticated, then redirect them.
	if (!auth) {
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
    it will be false if both conditions are false.
  */
	const isAuthorized =
		allowedRoles.length === 0 || allowedRoles.includes(auth.user.role);

	return isAuthorized ? children : <Navigate to="/unauthorized" />;
}

ProtectedRoute.propTypes = {
	allowedRoles: PropTypes.array,
	children: PropTypes.element,
};
