import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import getErrorData from "../../../../utils/getErrorData";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";

export default function useSaveTag() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	// Helper function for making PATCH request for existing category
	const saveExistingTag = async (tag) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.patch(`/tags/${tag._id}`, tag);
			return response.data; // Return the updated category data
		} catch (err) {
			handleRequestError(err);
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function for making POST request for a new category
	const createNewTag = async (tag) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.post("/tags", tag);
			return response.data; // Return the newly created category data
		} catch (err) {
			handleRequestError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRequestError = (err) => {
		if (err.response) {
			if (err.response.status === 429 && !submitDisabled) {
				setSubmitDisabled(true);
			}
			setError(getErrorData(err));
		} else if (err.request) {
			setError("Network Error!");
		} else {
			setError("Something unexpected happened!");
		}
	};

	return {
		error,
		isLoading,
		submitDisabled,
		saveExistingTag,
		createNewTag,
	};
}
