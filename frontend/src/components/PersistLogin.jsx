import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuthContext from "../hooks/useAuthContext";

export default function PersistLogin() {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuthContext();

	/*
  - Since we wrap around our routes, we should probably
    use Navigate to navigate to other places when things expire
  */

	useEffect(() => {
		let isMounted = true;

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
    - If auth state isn't defined, user isn't authenticated. So we'll
      try to reauthenticate them. 
    - Else, they should already be authenticated
    */
		if (auth) {
			isMounted && setIsLoading(false);
		} else {
			verifyRefreshToken();
		}

		return () => {
			isMounted = false;
		};
	}, [auth, refresh]);

	// While authenticating, show a loading screen, then when done show our outlet
	return isLoading ? <p>Loading...</p> : <Outlet />;
}
