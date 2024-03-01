import { useState } from "react";
import useAuthContext from "./useAuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import authActions from "../../constants/authActions";
import useSubmitDisabled from "./useSubmitDisabled";

export default function useChangeFullName() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();
	const endpoint = `/users/${auth.user._id}/fullName`;
	const axiosPrivate = useAxiosPrivate();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const changeFullName = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			const response = await axiosPrivate.patch(endpoint, formData);

			success = true;

			// On success, API should send back the updated user object
			dispatch({ type: authActions.updateUser, payload: response.data });
		} catch (err) {
			/*
      - You can watch for refresh token expiration here. The retry is done in the 
        axiosPrivate, so if we reach here then there's a chance we failed 
        the retry.
      - If we get a status code 401, that means we tried the request with 
        an invalid access token. However that also means our axiosPrivate 
        tried to refresh our access token and failed re-doing the request, so
        our refresh token is expired as well. This is the case where we want 
        to make the user type in their credentials again!

      1. Clear the auth state. That's obvious.
      2. But we also want smart redirects. Well the ProtectedRoute handles 
        that. once you clear the auth state, the protected route will trigger
        and take us to the login page. Then we'll login and we'll be logged 
        to the 

      */
			if (err.response) {
				// If failed due to rate limiting, then set submitDisabled to disable button on client side
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(err.response?.data?.message || "Server error occurred!");
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}

		// Return the success state
		return success;
	};

	return { error, isLoading, changeFullName, submitDisabled };
}
