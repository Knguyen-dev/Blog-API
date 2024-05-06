import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

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
			handleRequestError(err, setError);
		}
		setIsLoading(false);

		return success;
	};

	return { isLoading, error, deletePost };
}
