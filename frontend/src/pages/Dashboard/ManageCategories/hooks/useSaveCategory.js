import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useSaveCategory() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
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
			handleRequestError(err, setError);
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
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		error,
		setError,
		isLoading,
		saveExistingCategory,
		createNewCategory,
	};
}
