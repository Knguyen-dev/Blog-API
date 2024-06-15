import useAuthContext from "./useAuthContext";
import useLogout from "./useLogout";
import { axiosPublic } from "../api/axios";
import authActions from "../constants/authActions";
import useToast from "./useToast";

const endpoint = "/auth/refresh";

export default function useRefreshToken() {
  const { dispatch } = useAuthContext();
  const logout = useLogout();

  const { showToast } = useToast();
  /*
  - Call for the refresh token, which will set the global auth
    state and return the new access token.

  + Error handling when refresh token fails ():
  1. Refresh token is now expired. The jwt cookie is not longer in our 
    cookies, and so when we try to refresh it won't work. Of course 
    when we refresh our browser, things we're immediately sent right 
    back to the login page since the auth state is nulled. But if 
    you don't refresh our auth state is still defined, but our refresh 
    and access tokens are gone.

  2. Now when we try to make a private request such as changing fullName, the error we get is 
    'Unauthorized, access token is bad' or something similar. And 
    they are correct, our access token is expired!
    And our subsequent refreshes (request retries) didn't work so we never got a new one (since refresh token is bad too)

  3. So when refresh fails, we will logout the user immediately.
  */
  const refresh = async () => {
    try {
      const response = await axiosPublic.get(endpoint, {
        withCredentials: true,
      });
      dispatch({ type: authActions.login, payload: response.data });
      return response.data.accessToken;
    } catch (err) {
      /*
      - If catch block: Refresh token cookie expired, so the user has to enter
        their credentials again.
      1. Call logout function. This clears the auth state, clears our expired refresh
        token cookie, and it redirects the user to the login page.
      2. Show the toast to indicate that the user's 'session' has expired so 
        they have to log back in.
      */
      await logout();
      showToast({
        message: "User session has expired! Please log back in.",
        severity: "info",
      });
    }
  };

  return refresh;
}
