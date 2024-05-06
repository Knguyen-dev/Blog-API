import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useDeleteTag() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();

	const deleteTag = async (tagID) => {
		setIsLoading(true);
		setError(null);
		let success = false;
		try {
			await axiosPrivate.delete(`/tags/${tagID}`);
			success = true;
		} catch (err) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}
		return success;
	};

	return {
		error,
		isLoading,
		deleteTag,
	};
}
