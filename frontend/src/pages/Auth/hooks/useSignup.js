import { useState } from "react";
import axios from "../../../api/axios";
import useSubmitDisabled from "../../../hooks/useSubmitDisabled";
import getErrorData from "../../../utils/getErrorData";
const endpoint = "/auth/signup";

export default function useSignup() {
	/*
  1. error: Records unexpected errors that happen during our interaction
    with the server. Can include having troubles connecting to the server, or the server 
    sending back json saying something (could be an issue connecting to database). 
  2. isLoading: Determines if the signup process is still being processed.
    This is used to disable the signup button while the we wait for a response 
    for the server.

  3. signupDisabled: State that tracks when we should disable the signup
    button due to a '429' or when the user was making too many requests 
    to the server!

  - NOTE: Of course you could simply return 'data' and if !success you can
    overwrite the form errors there, but I found it a little cleaner to have 
    it in a state and use an effect to render out server-side validation errors. 
    It allows us to just return 'success' form our signup hook, and it kept error 
    handling in our useSignup hook.
  */
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled(60000);

	/*
  - Four cases:
  1. Response Ok: The form was successful. In this case, 'data'
  would contain an object with a 'message' property indicating success.

  2. Response 429: Rate limit exceeded. The signup button is disabled, and an
  error message is displayed. 'submitDisabled' is set to true to prevent further
  requests until the rate limit window resets.

  3. Other error codes (e.g., 500): An unexpected error occurred on the server.
  In this case, the error message returned by the server is set in the 'error' state.

  - Catch block: Handles network errors or errors in setting up the request on the client side.

  */
	const signup = async (formData) => {
		// Set loading to true and reset server errors
		setIsLoading(true);

		setError(null);
		let success = false;
		try {
			await axios.post(endpoint, formData);
			success = true;
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}

				setError(getErrorData(err));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			// Regardless, indicate we aren't loading anymore
			setIsLoading(false);
		}

		// Return success and data
		return success;
	};

	return { error, isLoading, signup, submitDisabled };
}
