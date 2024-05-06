import { useState } from "react";
import axios from "../../../api/axios";
import handleRequestError from "../../../utils/handleRequestError";
const endpoint = "/auth/signup";

export default function useSignup() {
	/*
  1. error: Records unexpected errors that happen during our interaction
    with the server. Can include having troubles connecting to the server, or the server 
    sending back json saying something (could be an issue connecting to database). 
  2. isLoading: Determines if the signup process is still being processed.
    This is used to disable the signup button while the we wait for a response 
    for the server.

  - NOTE: Of course you could simply return 'data' and if !success you can
    overwrite the form errors there, but I found it a little cleaner to have 
    it in a state and use an effect to render out server-side validation errors. 
    It allows us to just return 'success' form our signup hook, and it kept error 
    handling in our useSignup hook.
  */
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const signup = async (formData) => {
		// Set loading to true and reset server errors
		setIsLoading(true);

		setError(null);
		let success = false;
		try {
			await axios.post(endpoint, formData);
			success = true;
		} catch (err) {
			handleRequestError(err, setError);
		} finally {
			// Regardless, indicate we aren't loading anymore
			setIsLoading(false);
		}

		// Return success and data
		return success;
	};

	return { error, isLoading, signup };
}
