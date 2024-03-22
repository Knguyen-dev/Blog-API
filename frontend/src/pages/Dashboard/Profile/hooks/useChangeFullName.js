import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import authActions from "../../../../constants/authActions";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";
import getErrorData from "../../../../utils/getErrorData";

export default function useChangeFullName() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();
	const endpoint = `/users/${auth.user._id}/fullName`;
	const axiosPrivate = useAxiosPrivate();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const changeFullName = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			const response = await axiosPrivate.patch(endpoint, formData);

			success = true;

			// On success, API should send back the updated user object
			dispatch({ type: authActions.updateUser, payload: response.data });
		} catch (err) {
			if (err.response) {
				// If failed due to rate limiting, then set submitDisabled to disable button on client side
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(getErrorData(err));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}

		// Return the success state
		return success;
	};

	return { error, isLoading, changeFullName, submitDisabled };
}
