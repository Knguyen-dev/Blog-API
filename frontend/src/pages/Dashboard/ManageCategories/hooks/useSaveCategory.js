import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import getErrorData from "../../../../utils/getErrorData";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";

export default function useSaveCategory() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	// Helper function for making PATCH request for existing category
	const saveExistingCategory = async (category) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.patch(
				`/categories/${category._id}`,
				category
			);
			return response.data; // Return the updated category data
		} catch (err) {
			handleRequestError(err);
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function for making POST request for a new category
	const createNewCategory = async (category) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.post("/categories", category);
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
			setError(getErrorData(err, false));
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
		saveExistingCategory,
		createNewCategory,
	};
}
