import useAuthContext from "../../../../hooks/useAuthContext";
import authActions from "../../../../constants/authActions";
import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useChangeAvatar() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();

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
			const user = response.data;
			dispatch({ type: authActions.updateUser, payload: user });
		} catch (err) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		error,
		isLoading,
		changeAvatar,
	};
}
