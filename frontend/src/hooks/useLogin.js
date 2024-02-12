import { useState } from "react";
import useAuthContext from "./useAuthContext";

export default function useLogin() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { setAuth } = useAuthContext();

	const login = async (username, password) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("http://localhost:3000/auth/login", {
				method: "POST",
				// Browser sends cookies on request, allowing server to set cookies in the response
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});
			const json = await response.json();

			/*
      - If login successful, then update global state with 
       json, representing our user. Our json should be 
       an object that contains jwt access token.
      - Else, update the error to the error message we got 
        from the server. For the login endpoint, the error 
        should be in form {message: 'some error message' }.
      - catch block: If something went wrong whilst making the request.
      */
			if (response.ok) {
				setAuth(json);
			} else {
				setError(json.message);
			}
		} catch (err) {
			setError("Something went wrong. Try again later!");
		}

		// Finished process, so stop isLoading.
		setIsLoading(false);
	};

	return { error, isLoading, login };
}
