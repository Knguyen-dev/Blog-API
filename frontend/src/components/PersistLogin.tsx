import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../../frontend/src/hooks/useRefreshToken";
import useAuthContext from "../../../frontend/src/hooks/useAuthContext";

/*
- Component that tries to refresh the user's access token, the component senses that the 
  auth.user object is null (user isn't logged in). We'd wrap this around the routes, where 
  you'd to check if the user is reauthenticated. In this case we wrap this around our app, or
  all of our routes since on refresh of our app. so we'll make it so this
  effect (the re-authentication) only happens on app load, so we only run it once.
  When does this component act?:

  1. If user logs in, or logs out. In the former, the auth state becomes
    defined, our effect runs but it sees auth is already defined so it 
    doesn't try to refresh the user's access token (doesn't try to reauthenticate the user).
  2. When the app first loads, auth.user will be null, so the effect will run and 
    the since auth.user is falsy, we'll try to get a new access token (try to reauthenticate the user).
*/
export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuthContext();

  useEffect(() => {
    let isMounted = true;

    /**
     * Handles refreshing the access token with our refresh token
     */
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    /*
    - If auth state is defined, user is already authenticated so just set
      loading to false and take them to the page they were going to.
    - Else auth state isn't defined, user isn't authenticated. So we'll
      try to reauthenticate them. 
    */

    if (auth.user) {
      isMounted && setIsLoading(false);
    } else {
      verifyRefreshToken();
    }

    return () => {
      isMounted = false;
    };

    /*
    - Only run this component once, so we only check if we can refresh the 
    user's credentials once. We avoid using the dependency because there 
    are cases when it refreshes when it doesn't need to.

    If we left auth.user as a dependency, then this would happen: When a user logs
    out, the auth.user state changes to null, and then this effect will run
    again and try to refresh the user, even when they've just logged themselves out.

    We don't want to unnecessarily try to refresh the user when they've clearly logged themselves
    out, that's not needed.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return;
  }

  // While authenticating, show a loading screen, then when done show our outlet
  return <Outlet />;
}
