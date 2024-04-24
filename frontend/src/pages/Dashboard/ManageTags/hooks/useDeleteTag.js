import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import getErrorData from "../../../../utils/getErrorData";
import useSubmitDisabled from "../../../../hooks/useSubmitDisabled";

export default function useDeleteTag() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const deleteTag = async (tagID) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			await axiosPrivate.delete(`/tags/${tagID}`);
			success = true;
		} catch (err) {
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
		} finally {
			setIsLoading(false);
		}
		return success;
	};

	return {
		error,
		isLoading,
		submitDisabled,
		deleteTag,
	};
}
