import useLogout from "../../../../hooks/useLogout";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useState } from "react";
import getErrorData from "../../../../utils/getErrorData";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";

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

		try {
			// Do a delete request on the user on the backend.
			await axiosPrivate.delete(endpoint, {
				data: formData,
			});

			// If successful, mark it as so, and get the object containing the success message
			// sent by our server.
			success = true;

			// Then clear/logout the user for front-end/back-end
			await logout();
		} catch (err) {
			if (err.response) {
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

		return success;
	};

	return { error, isLoading, deleteAccount, submitDisabled };
}
