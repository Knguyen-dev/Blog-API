import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import getErrorData from "../../../../utils/getErrorData";

export default function useSavePostStatus() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	// Handles making request to update the status of a post
	const savePostStatus = async (id, formData) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.patch(
				`/posts/${id}/status`,
				formData
			);

			// on success, return the newly updated post
			return response.data;
		} catch (err) {
			if (err.response) {
				setError(getErrorData(err));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		}

		setIsLoading(false);
	};

	return { isLoading, error, savePostStatus };
}
