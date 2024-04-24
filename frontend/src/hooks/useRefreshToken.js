import useAuthContext from "./useAuthContext";
import useLogout from "./useLogout";

import axios from "../api/axios";
import authActions from "../constants/authActions";
import useToast from "./useToast";

const endpoint = "/auth/refresh";

export default function useRefreshToken() {
	const { auth, dispatch } = useAuthContext();
	const logout = useLogout();

	const { showToast } = useToast();
	/*
  - Call for the refresh token, which will set the global auth
    state and return the new access token.

  - NOTE: Refreshing the access token just involves us making the request 
    with the jwt cookie. We don't need to use axiosPrivate since axiosPrivate
    is for loading our requests with the access token and whatnot.


  + Error handling when refresh token fails:
  - Here we have our code for refreshing our access token. If the refresh token
    fails do we want to nullify the state in this function? Well that 
    sounds like actually the right thing to do however we want to do 
    we want the smart redirect like Dave Gray does. Here's what's happening 
  
  1. Refresh token is now expired. The jwt cookie is not longer in our 
    cookies, and so when we try to refresh it won't work. Of course 
    when we refresh our browser, things we're immediately sent right 
    back to the login page since the auth state is nulled. But if 
    you don't refresh our auth state is still defined, but our refresh 
    and access tokens are gone.

  2. Now when we try to change fullName, the error we get is 
    'Unauthorized, access token is bad' or something similar. And 
    they are correct, the access token we have is actually expired!
    And our subsequent refreshes didn't work so we never got a new one

  3. Now our solution: While the solution of setting auth to null
    in useRefreshToken sounds nice, i can't help but wonder if 
    this is indeed the right choice. Definitely resetting the 
    auth state in refresh() will cover all bases. However 
  

  */
	const refresh = async () => {
		try {
			const response = await axios.get(endpoint, {
				withCredentials: true,
			});
			dispatch({ type: authActions.login, payload: response.data });
			return response.data.accessToken;
		} catch (err) {
			console.log("Failed to refresh 'access token': ", err);

			/*
      - If catch block: Refresh token cookie expired, so the user has to enter
        their credentials again.
      1. Call logout function. This clears the auth state, clears our expired refresh
        token cookie, and it redirects the user to the login page.
      2. Show the toast to indicate that the user's 'session' has expired so 
        they have to log back in.
      
      - NOTE: 
      - We first make sure our auth state is defined to prevent 
        unnecessary state updates. For example, the user logs out and nulls
        the auth state. Then we refresh, and PersistLogin will try to refresh the 
        user's access token but fail. That failure will trigger this catch block. 
        If we didn't have this conditional, the auth state be cleared via logout(), even though
        it's already clear. So with this conditional, we just prevent that unnecessary
        auth state update from happening. This 'auth.user' still being defined just means 
        the user's credentials expired, but the auth state wasn't cleared yet so we 
        just need to clear it.
      */
			if (auth.user) {
				await logout();
				showToast({
					message: "User session has expired! Please log back in.",
					severity: "info",
				});
			}
		}
	};

	return refresh;
}
