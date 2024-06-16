import useAuthContext from "./useAuthContext";
import useLogout from "./useLogout";
import { axiosPublic } from "../api/axios";
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

      - NOTE: It's important that you first check if auth.user is defined (user is authenticated) before 
        using the logout function and showing the toast. This is to prevent us calling this logic unnecessarily.

        For example, the user loads the website. The PersistLogin function will trigger and try to refresh the user's access token. 
        This request to the refresh endpoint will be done twice and fail since they don't have a refresh token cookie, and this triggers this catch block.

        Now there are two cases:
        - If auth.user: This means the user tried to make a private request, the server responds finds that not only their access token is bad, but 
          their refresh token is also bad. So they need to login and enter their credentials again. In this case we explicitly logout the user and give
          them a message saying their 'session' expired.

        - Else !auth.user: This can represent the case where the user has gone on the site for the first time in a while (they don't have a refresh token cookie)
          and their auth.user is nulled. In this case, the user is already unauthenticated, we don't want to spam them by logging them out for no reason and 
          showing the toast message. 
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
