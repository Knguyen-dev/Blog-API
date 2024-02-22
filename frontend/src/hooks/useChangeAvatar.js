import useAuthContext from "./useAuthContext";
import authActions from "../constants/authActions";
import { useState } from "react";
import axios from "../api/axios";

export default function useChangeAvatar() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { auth, dispatch } = useAuthContext();

	const changeAvatar = async (imgFile) => {
		setIsLoading(true);
		setError(null);

		const endpoint = `/users/${auth.user._id}/avatar`;

		const formData = new FormData();
		formData.append("file", imgFile);

		try {
			const response = await axios.patch(endpoint, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// API should return a new user, with updated avatar
			const user = response.data.user;

			dispatch({ type: authActions.updateUser, payload: user });
		} catch (err) {
			console.log(err);
			if (err.response) {
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
	};
}
