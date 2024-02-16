import { useState } from "react";
import axios from "../api/axios";

const endpoint = "/auth/signup";

export default function useSignup() {
	/*
  1. error: Records unexpected errors that happen during our interaction
    with the server. Can include having troubles connecting to the server, or the server 
    sending back json saying something (could be an issue connecting to database). 
  2. isLoading: Determines if the signup process is still being processed.

  - NOTE: Of course you could simply return 'data' and if !success you can
    overwrite the form errors there, but I found it a little cleaner to have 
    it in a state and use an effect to render out server-side validation errors. 
    It allows us to just return 'success' form our signup hook, and it kept error 
    handling in our useSignup hook.
  */
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	/*
  - Four cases:
  1. Response Ok: The form was a success. In this case 'data'
    would just be an object with property 'message' saying it was a 
    success. 
  2. Response 400: Form wasn't good as some serverside validation
    found some of the fields were invalid. In this case 'data' would 
    be an object filled with errors for the form fields that we'll use.
    So basically nothing needs to be done in useSignup anyways.
  3. If we're getting a 500 or some other error code something unexpected 
    went wrong on the server's side. So just set an error message.
  - catch block: Something went wrong simply trying to connect to the server from
    our client application.
  */
	const signup = async (
		email,
		username,
		password,
		confirmPassword,
		fullName
	) => {
		// Set loading to true and reset server errors
		setIsLoading(true);
		setError(null);
		let success = false;
		let data = null;

		try {
			await axios.post(endpoint, {
				email,
				username,
				password,
				confirmPassword,
				fullName,
			});

			// Should be a status 200, so at this point we're successful.
			success = true;
		} catch (err) {
			/*
      - If status 400: Set the data, which are the form error messages.
      - Else, something other than the form validation went wrong.

      - NOTE: Why optional chaining? Well in the case we can't connect
        to the server (network error), response is null. So we don't want to get a javascript
        error whilst checking because it could be network error or a server error.
      */
			if (err?.response?.status === 400) {
				data = err.response.data;
			} else {
				setError(
					err?.response?.data?.message ||
						"Something went wrong. Try again later!"
				);
			}
		} finally {
			// Regardless, indicate we aren't loading anymore
			setIsLoading(false);
		}

		// Return success and data
		return { success, data };
	};

	return { error, isLoading, signup };
}
