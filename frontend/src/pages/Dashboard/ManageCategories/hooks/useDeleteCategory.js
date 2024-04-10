import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import getErrorData from "../../../../utils/getErrorData";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";

export default function useDeleteCategory() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const deleteCategory = async (categoryID) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			await axiosPrivate.delete(`/categories/${categoryID}`);
			success = true;
		} catch (err) {
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
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return {
		error,
		isLoading,
		submitDisabled,
		deleteCategory,
	};
}
