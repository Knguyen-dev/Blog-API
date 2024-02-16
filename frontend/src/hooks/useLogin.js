import { useState } from "react";
import useAuthContext from "./useAuthContext";
import { axiosPrivate } from "../api/axios";
const endpoint = "/auth/login";

export default function useLogin() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { setAuth } = useAuthContext();

	const login = async (username, password) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.post(endpoint, {
				username,
				password,
			});

			/*
      - Set the auth state to what we got from the endpoint. We should 
      be getting an object with the user's role, and access token.
      */
			setAuth(response.data);
		} catch (err) {
			/*
      - Could be a server-side validation error, some other server-side error, 
        or a network error we'll. For the first two, we can set the error message
        with the json data, but for the third we can default a hard-coded error message.

      1. If err.response exists, the server respodned with a status code that falls out 
        of range 2xx
      2. If err.request, then the request was made but no response was received.
      3. Else, something happened in setting up the request that triggered an error.

      + Credit: https://axios-http.com/docs/handling_errors
      */
			if (err.response) {
				setError(err?.response?.data?.message || "Server error occurred!");
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return { error, isLoading, login };
}
