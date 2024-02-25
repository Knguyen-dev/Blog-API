import { useState } from "react";
import axios from "../../api/axios";

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
	const signup = async (formData) => {
		// Set loading to true and reset server errors
		setIsLoading(true);
		setError(null);
		let success = false;
		let data = null;

		try {
			const response = await axios.post(endpoint, formData);

			// Should be a status 200, so at this point we're successful.
			success = true;

			// On success, we'll return the success message that was set up by the server!
			data = response.data;
		} catch (err) {
			/*
      - Conditionals:
      1. If err.response: A server error happened. If it's status code 
        400, then the error happened due to server-side validation.
        We get back an error object defining errors for each field. We want to return this as 'data' so we can do setError in our sign up form. 
        Else, regardless of status code we should get an error object
        in form {message: some_error_message}. For this type of error, we want to 
        set the error state on the hook, which will later allow us to display these 
        types of errors differently on the form.
      2. Else if (err.request): A network error, so set the error state of the hook
      3. Else: Something went wrong on the client side when setting up the request.
        This is usually due to a programming error or something similar.
      */
			if (err.response) {
				if (err.response.status === 400) {
					data = err.response.data;
				} else {
					setError(err.response.data?.message || "Server error occurred!");
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

	return { error, isLoading, signup };
}
