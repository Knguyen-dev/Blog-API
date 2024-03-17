import { useState } from "react";
import axios from "../../api/axios";
const endpoint = "/auth/signup";
import useSubmitDisabled from "./useSubmitDisabled";

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

  2. Response 400: Server-side validation failed, and some fields are invalid.
  'data' would be an object containing errors for the form fields, which will
  be used to display error messages next to the corresponding fields in the form.

  3. Response 429: Rate limit exceeded. The signup button is disabled, and an
  error message is displayed. 'submitDisabled' is set to true to prevent further
  requests until the rate limit window resets.

  4. Other error codes (e.g., 500): An unexpected error occurred on the server.
  In this case, the error message returned by the server is set in the 'error' state.

  - Catch block: Handles network errors or errors in setting up the request on the client side.

  - Note about error messages: The signup and change password endpoints return
    error objects with field names as keys and error messages as values to handle
    server-side validation for multiple fields. Other endpoints return a generic
    error message object { message: "some_error_message" } for simplicity. 
  */
	const signup = async (formData) => {
		// Set loading to true and reset server errors
		setIsLoading(true);

		setError(null);
		let success = false;
		let data = null;

		try {
			await axios.post(endpoint, formData);

			// Should be a status 200, so at this point we're successful.
			success = true;
		} catch (err) {
			if (err.response) {
				if (err.response.status === 400) {
					data = err.response.data;
				} else if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
					setError(err.response.data.error.message);
				} else {
					setError(err.response.data?.error.message);
				}
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
		return { success, data };
	};

	return { error, isLoading, signup, submitDisabled };
}
