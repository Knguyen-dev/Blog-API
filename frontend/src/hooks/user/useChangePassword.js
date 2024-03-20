import { useState } from "react";
import useAuthContext from "./useAuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import useLogout from "./useLogout";
import useSubmitDisabled from "./useSubmitDisabled";
import getErrorData from "../../utilities/getErrorData";

export default function useChangePassword() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth } = useAuthContext();
	const logout = useLogout();
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const endpoint = `/users/${auth.user._id}/password`;

	const changePassword = async (formData) => {
		setIsLoading(true);
		setError(null);

		/*
    - success: Boolean indicating whether the changePassword process was 
      successful or not. I'm planning to use this later so that we can trigger 
      a snackbar.

    - NOTE: Since we have front-end validation with yup. If there is 
      any server-side validation errors, then it will be because of 
      database checks that we performed. In this case, it will be 
      when the user inputted the incorrect password for the 'oldPassword'
      field.
    */
		let success = false;

		try {
			// Make a patch request to change the password of the user
			await axiosPrivate.patch(endpoint, formData);

			success = true;

			// First request was successful, run function to log out the user.
			await logout();

			// On success, we will reset the auth state with our useLogout Hook
		} catch (err) {
			/*
      - Conditionals:
      1. If server error.
      2. Else if (err.request): A network error, so set the error state of the hook
      3. Else: Something went wrong on the client side when setting up the request.
        This is usually due to a programming error or something similar.
      */
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					// Rate limiting error, so disable submit button and show rate limit error message.
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

		// Return the success state, and the data
		return success;
	};

	return { error, isLoading, changePassword, submitDisabled };
}
