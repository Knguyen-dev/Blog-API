import useAuthContext from "./useAuthContext";
import authActions from "../../constants/authActions";
import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import useSubmitDisabled from "./useSubmitDisabled";

export default function useChangeAvatar() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	// Use axiosPrivate hook since we need to send over our access token for this request
	const axiosPrivate = useAxiosPrivate();

	const endpoint = `/users/${auth.user._id}/avatar`;

	/*
  - Makes a patch request to update the avatar. 
  */
	const updateAvatar = (file) => {
		const formData = new FormData();
		formData.append("file", file);
		return axiosPrivate.patch(endpoint, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	};

	// Makes a delete request to delete the avatar
	const deleteAvatar = () => {
		return axiosPrivate.delete(endpoint);
	};

	/*
  + Function for updating/changing the user's avatar. This 
  includes adding an avatar, or updating the user's current avatar with a new one,
  and the act of simply removing/deleting the current avatar.

  1. If a file was passed, then the user is trying to add or updating their current
    avatar.
  2. Else, if no file was passed, that means they want to remove/delete their avatar
  */
	const changeAvatar = async (file) => {
		setIsLoading(true);
		setError(null);

		try {
			let response = null;
			if (file) {
				response = await updateAvatar(file);
			} else {
				response = await deleteAvatar();
			}

			// API should return a new user, with updated avatar
			const user = response.data.user;

			dispatch({ type: authActions.updateUser, payload: user });
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(err?.response?.data?.message || "Server error occurred!");
			} else if (err.request) {
				setError("Network Error!");
			} else {
				setError("Something unexpected happened!");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return {
		error,
		isLoading,
		changeAvatar,
		submitDisabled,
	};
}
