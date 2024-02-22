import axios from "../api/axios";
import useAuthContext from "./useAuthContext";
import authActions from "../constants/authActions";
const endpoint = "/auth/logout";

export default function useLogout() {
	const { dispatch } = useAuthContext();

	/*
  + Wipes global auth state, and makes call to wipe refresh token cookie.
  */
	const logout = async () => {
		try {
			await axios(endpoint, {
				withCredentials: true,
			});
			dispatch({ type: authActions.logout });
		} catch (err) {
			console.error("Error logging out: ", err?.response);
		}
	};

	return logout;
}
