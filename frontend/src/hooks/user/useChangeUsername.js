import { useState } from "react";
import useAuthContext from "./useAuthContext";
import authActions from "../../constants/authActions";
import useAxiosPrivate from "../useAxiosPrivate";
import useSubmitDisabled from "./useSubmitDisabled";

export default function useChangeUsername() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();
	const axiosPrivate = useAxiosPrivate();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();
	const endpoint = `/users/${auth.user._id}/username`;

	const changeUsername = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			const response = await axiosPrivate.patch(endpoint, formData);

			// At this point we have a successful username change
			success = true;

			// On success, API should send back the updated user object
			dispatch({ type: authActions.updateUser, payload: response.data });
		} catch (err) {
			if (err.response) {
				// If failed due to rate limiting, then set submitDisabled to disable button on client side
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				// If server sent the error, we expect the error message to be in this structure
				setError(err.response?.data?.message || "Server error occurred!");
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

	return { error, isLoading, changeUsername, submitDisabled };
}
