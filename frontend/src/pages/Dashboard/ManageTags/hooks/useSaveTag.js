import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useSaveTag() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();

	// Helper function for making PATCH request for existing category
	const saveExistingTag = async (tag) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axiosPrivate.patch(`/tags/${tag._id}`, tag);
			return response.data; // Return the updated category data
		} catch (err) {
			handleRequestError(err, setError);
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

	return {
		error,
		setError,
		isLoading,
		saveExistingTag,
		createNewTag,
	};
}
