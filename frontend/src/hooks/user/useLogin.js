import { useState } from "react";
import useAuthContext from "./useAuthContext";
import { axiosPrivate } from "../../api/axios";
import authActions from "../../constants/authActions";
import getErrorData from "../../utilities/getErrorData";
import useSubmitDisabled from "./useSubmitDisabled";

const endpoint = "/auth/login";

export default function useLogin() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();
	const { dispatch } = useAuthContext();

	const login = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			const response = await axiosPrivate.post(endpoint, formData);

			// indicate successful login
			success = true;

			/*
      - Set the auth state to what we got from the endpoint. We should 
      be getting an object with the user's role, and access token.
      */
			dispatch({ type: authActions.login, payload: response.data });
		} catch (err) {
			/*
      - Could be a server-side validation error, some other server-side error, 
        or a network error we'll. For the first two, we can set the error message
        with the json data, but for the third we can default a hard-coded error message.

      1. If err.response exists, the server respodned with a status code that falls out 
        of range 2xx. Here if we got a '429', we set state to disable the login button.
        Finally we set the error message that we got from our server. Also make sure 
        that loginDisabled = false, we don't really want to update state to true if it's already true.

      2. If err.request, then the request was made but no response was received.
      3. Else, something happened in setting up the request that triggered an error.
        Here it's probably a code error in the front end code.

      + Credit: https://axios-http.com/docs/handling_errors
      */
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(getErrorData(err, false));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return { error, isLoading, login, submitDisabled };
}
