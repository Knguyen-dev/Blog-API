import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import getErrorData from "../../../utils/getErrorData";

// Maybe pass in a state setter
export default function useDeletePost() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	const deletePost = async (id) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			// Do a delete request to the express server
			await axiosPrivate.delete(`/posts/${id}`);

			success = true;
		} catch (err) {
			if (err.response) {
				setError(getErrorData(err, false));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
		}
		setIsLoading(false);

		return success;
	};

	return { isLoading, error, deletePost };
}
