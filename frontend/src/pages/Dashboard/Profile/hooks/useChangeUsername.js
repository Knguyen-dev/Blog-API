import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import authActions from "../../../../constants/authActions";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useChangeUsername() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();
	const axiosPrivate = useAxiosPrivate();

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
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return { error, isLoading, changeUsername };
}
