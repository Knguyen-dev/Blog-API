import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuthContext from "../hooks/useAuthContext";

/*
- We'd wrap this around the routes that need authentication. 
  In this case it's our entire app that needs this. So each time the 
  auth changes, then this PersistLogin would do a check to see if auth is 
  still defined. When does this component act?:

  1. If user logs in, or logs out. In the former, the auth state becomes
    defined, our effect runs but it sees auth is already defined so it 
    doesn't try to look for another access token.
  2. If user does a refresh, auth will be null. However, when 
    this component mounts for the first time, it'll try to refresh 
    the user.



*/
export default function PersistLogin() {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuthContext();

	useEffect(() => {
		let isMounted = true;

		const verifyRefreshToken = async () => {
			console.log("Persisting Login!");
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// While authenticating, show a loading screen, then when done show our outlet
	return isLoading ? <p>Loading...</p> : <Outlet />;
}
