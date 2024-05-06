import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

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
			handleRequestError(err, setError);
		}

		setIsLoading(false);
	};

	return { isLoading, error, savePostStatus };
}
