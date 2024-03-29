import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import authActions from "../../../../constants/authActions";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";
import getErrorData from "../../../../utils/getErrorData";

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

				// Get the error message sent by the server
				setError(getErrorData(err));
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
