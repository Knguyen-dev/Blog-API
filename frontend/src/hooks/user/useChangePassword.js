import { useState } from "react";
import useAuthContext from "./useAuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import useLogout from "./useLogout";

export default function useChangePassword() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth } = useAuthContext();
	const logout = useLogout();
	const axiosPrivate = useAxiosPrivate();
	const endpoint = `/users/${auth.user._id}/password`;

	const changePassword = async (formData) => {
		setIsLoading(true);
		setError(null);

		/*
    - success: Boolean indicating whether the changePassword process was 
      successful or not. I'm planning to use this later so that we can trigger 
      a snackbar.

    - data: Variable that will contain the error object returned by server-side 
      form validation. If it's null, we can assume that no errors happened
      with the server-side form validation.

    - NOTE: Since we have front-end validation with yup. If there is 
      any server-side validation errors, then it will be because of 
      database checks that we performed. In this case, it will be 
      when the user inputted the incorrect password for the 'oldPassword'
      field.
    */
		let success = false;
		let data = null;

		try {
			// Make a patch request to change the password of the user
			const response = await axiosPrivate.patch(endpoint, formData);

			/*
      - Password change was successful at least, so mark this as true
			 So even if there's an error when logging out, we want to notify the user
			 that they have a new password. We should have gotten a success message from
       the server in the general form {message: some_success_message}. So store 
       this so that we can display this on our global snackbar. 
      */
			success = true;
			data = response.data;

			// First request was successful, run function to log out the user.
			await logout();

			// On success, we will reset the auth state with our useLogout Hook
		} catch (err) {
			/*
      - Conditionals:
      1. If err.response: A server error happened. If it's status code 
        400, then the error was with the first request as the input failed 
        server side validation. We should be getting back an error object defining errors for each
        field. We want to return this as 'data' so we can do setError in our change 
        password form. Else, regardless of status code we should get an error object
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
			setIsLoading(false);
		}

		// Return the success state, and the data
		return { success, data };
	};

	return { error, isLoading, changePassword };
}
