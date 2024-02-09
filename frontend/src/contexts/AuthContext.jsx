/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const authActions = {
	login: "LOGIN",
	logout: "LOGOUT",
};

const authReducer = (state, action) => {
	switch (action.type) {
		case authActions.login:
			return {
				user: action.payload,
			};

		case authActions.logout:
			return {
				user: null,
			};

		default:
			return state;
	}
};

const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});

	// effect that gets the user an access token probably

	//

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

AuthContextProvider.propTypes = {
	children: PropTypes.element,
};

export { AuthContext, authActions, AuthContextProvider };
