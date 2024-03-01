import useLogout from "./useLogout";
import useAuthContext from "./useAuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useState } from "react";

import useSubmitDisabled from "./useSubmitDisabled";

export default function useDeleteAccount() {
	const logout = useLogout();
	const { auth } = useAuthContext();
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const endpoint = `/users/${auth.user._id}`;

	const deleteAccount = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;
		let data = null;

		try {
			// Do a delete request on the user on the backend.
			const response = await axiosPrivate.delete(endpoint, {
				data: formData,
			});

			// If successful, mark it as so, and get the object containing the success message
			// sent by our server.
			success = true;
			data = response.data;

			// Then clear/logout the user for front-end/back-end
			await logout();
		} catch (err) {
			// If server-side validation sent the error, we expect the error message to be in this structure
			if (err.response) {
				if (err.response.status === 400) {
					data = err.response.data;
				} else if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
					setError(err.response?.data?.message || "Server error occurred!");
				} else {
					setError(err.response?.data?.message || "Server error occurred!");
				}
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}

		return { success, data };
	};

	return { error, isLoading, deleteAccount, submitDisabled };
}
