import { createContext, useReducer, ReactNode } from "react";
import authActions from "../constants/authActions";
import { AuthState } from "../types/Auth";

const AuthContext = createContext<{
	auth: AuthState;
	dispatch: React.Dispatch<any>;
}>({
	auth: {
		user: null,
		accessToken: null,
	},
	dispatch: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

const authReducer = (state: AuthState, action: any) => {
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

const AuthProvider = ({ children }: AuthProviderProps) => {
	const [auth, dispatch] = useReducer(authReducer, {
		user: null,
		accessToken: null,
	} as AuthState);

	return (
		<AuthContext.Provider value={{ auth, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
