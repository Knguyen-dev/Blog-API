import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";

export default function useDeletePost() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const axiosPrivate = useAxiosPrivate();

	const deletePost = async (id: string) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			// Do a delete request to the express server
			await axiosPrivate.delete(`/posts/${id}`);

			success = true;
		} catch (err: any) {
			handleRequestError(err, setError);
		}
		setIsLoading(false);

		return success;
	};

	return { isLoading, error, deletePost };
}
