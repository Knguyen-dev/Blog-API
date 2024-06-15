import { createContext, useReducer, ReactNode, Dispatch } from "react";
import authActions from "../constants/authActions";
import { AuthState, AuthActionType } from "../types/Auth";

export const AuthContext = createContext<{
  auth: AuthState;
  dispatch: Dispatch<AuthActionType>;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authReducer = (state: AuthState, action: any): AuthState => {
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

/**
 * Context provider for providing the authentication state of the current user.
 *
 * - User: Used to mainly show the user's current information such as their username, email, etc.
 * - accessToken: Used for making authenticated requests (requests whree an access token is need).
 *
 * NOTE: So when user isn't logged in, both of these are nulled, so you can easily say that a user is
 * authenticated when either the auth.user value is null or the auth.accessToken value is null.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const [auth, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
  } as AuthState);

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
