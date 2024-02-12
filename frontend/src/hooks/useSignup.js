import { useState } from "react";

export default function useSignup() {
	/*
  1. formErrors: Records server validation errors so that we can display them.
  2. serverError: Records unexpected errors that happen during our interaction
    with the server. Can include having troubles connecting to the server, or the server 
    sending back json saying something (could be an issue connecting to database). 
  3. isLoading: Determines if the signup process is still being processed.

  - NOTE: Of course you could simply return 'data' and if !success you can
    overwrite the form errors there, but I found it a little cleaner to have 
    it in a state and use an effect to render out server-side validation errors. 
    It allows us to just return 'success' form our signup hook, and it kept error 
    handling in our useSignup hook.
  */
	const [formErrors, setFormErrors] = useState(null);
	const [serverError, setServerError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const signup = async (
		email,
		username,
		password,
		confirmPassword,
		fullName
	) => {
		setIsLoading(true);
		setServerError(null);
		setFormErrors(null);

		/*
    - success: Boolean that indicates whether or not signup() actually
      worked or was there an error during the signup process. Then 
      this boolean will be used to decide whether or not we'll redirect
      the user to the login page, or keep them on the signup page to 
      show them their errors.
    - data: Data from express-server, but if response 400, then 'data' is 
      an object of errors that we can use to render server-side errors with.
    */
		let success = false;
		let data = null;

		try {
			const response = await fetch("http://localhost:3000/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					username,
					password,
					confirmPassword,
					fullName,
				}),
			});

			data = await response.json();

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
			if (response.ok) {
				success = true;
			} else if (response.status === 400) {
				setFormErrors(data);
			} else {
				setServerError(data.message || "Something went wrong. Try again later");
			}
		} catch (err) {
			setServerError("Something went wrong. Try again later");
		} finally {
			setIsLoading(false);
		}
		return success; // return status of the signup
	};

	return { formErrors, serverError, isLoading, signup };
}
