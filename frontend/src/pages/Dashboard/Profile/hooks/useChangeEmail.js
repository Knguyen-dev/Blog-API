import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import authActions from "../../../../constants/authActions";

import handleRequestError from "../../../../utils/handleRequestError";

export default function useChangeEmail() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();
	const endpoint = `/users/${auth.user._id}/email`;
	const axiosPrivate = useAxiosPrivate();

	const changeEmail = async (formData) => {
		setIsLoading(true);
		setError(null);
		let success = false;
		try {
			const response = await axiosPrivate.patch(endpoint, formData);
			success = true;
			// On success, API should send back the updated user object
			dispatch({ type: authActions.updateUser, payload: response.data });
		} catch (err) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}

		// Return the success state
		return success;
	};

	return { error, isLoading, changeEmail };
}
