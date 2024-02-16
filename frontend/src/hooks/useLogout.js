import axios from "../api/axios";
import useAuthContext from "./useAuthContext";

const endpoint = "/auth/logout";

export default function useLogout() {
	const { setAuth } = useAuthContext();

	/*
  + Wipes global auth state, and makes call to wipe refresh token cookie.
  
  - NOTE: It's important that we wait until the axios request is finished
    and our 'jwt' cookie is cleared before we schedule a state change. 
    If setAuth() was called before axios, then PersistLogin's effect will
    run and try to refresh the access token. Here there's a chance that the 
    axios call hasn't finished removing that jwt cookie, and as a result 
    the verifyRefreshToken will be successful in refreshing the access token. 
    As a result we will have removed the jwt cookie, but our global state will 
    still be defined with a user and access token.
  */
	const logout = async () => {
		try {
			await axios(endpoint, {
				withCredentials: true,
			});
			setAuth(null);
		} catch (err) {
			console.error("Error logging out: ", err?.response);
		}
	};

	return logout;
}
