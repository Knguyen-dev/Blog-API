import useAuthContext from "./useAuthContext";
import axios from "../api/axios";

const endpoint = "/auth/refresh";

export default function useRefreshToken() {
	const { setAuth } = useAuthContext();
	/*
  - Call for the refresh token, which will set the global auth
    state and return the new access token.
  */
	const refresh = async () => {
		try {
			const response = await axios.get(endpoint, {
				withCredentials: true,
			});
			setAuth(response.data);
			return response.data.accessToken;
		} catch (err) {
			console.error("Failed to refresh 'access token': ", err);
		}
	};

	return refresh;
}
