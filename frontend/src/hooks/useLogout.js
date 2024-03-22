import axios from "../api/axios";
import useAuthContext from "./useAuthContext";
import authActions from "../constants/authActions";
const endpoint = "/auth/logout";

export default function useLogout() {
	const { dispatch } = useAuthContext();

	/*
  + Wipes global auth state (front-end), and makes call to wipe refresh token cookie (backend).

  - NOTE: Since there are no try/catch blocks here, the error will be propagated up
    to the nearest try/catch. This is especially convenient in useChangePassword as 
    our changePassword has a single try/catch that covers multiple requests.
  */
	const logout = async () => {
		await axios(endpoint, {
			withCredentials: true,
		});
		dispatch({ type: authActions.logout });
	};

	return logout;
}
