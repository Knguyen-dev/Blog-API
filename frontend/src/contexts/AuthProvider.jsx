import { createContext, useReducer } from "react";
import authActions from "../constants/authActions";
import PropTypes from "prop-types";

const AuthContext = createContext();

const authReducer = (state, action) => {
	switch (action.type) {
		// Logging in case, assume action.payload is an object {user, accessToken}
		case authActions.login:
			return {
				user: action.payload.user,
				accessToken: action.payload.accessToken,
			};

		// If they logout, reset the user back to null
		case authActions.logout:
			return {
				user: null,
				accessToken: null,
			};

		// Expecting payload to be updated user object from backend
		case authActions.updateUser:
			return {
				...state,
				user: action.payload,
			};

		// Bad action so just return the state for now
		default:
			throw Error(`Unknown action '${action.type}' was used!`);
	}
};

const AuthProvider = ({ children }) => {
	const [auth, dispatch] = useReducer(authReducer, {
		user: null,
		accessToken: null,
	});

	return (
		<AuthContext.Provider value={{ auth, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
AuthProvider.propTypes = {
	children: PropTypes.element,
};

export { AuthContext, AuthProvider };
