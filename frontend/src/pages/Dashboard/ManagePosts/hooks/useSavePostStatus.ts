import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";
import { PostStatusType } from "../../../../types/Post";

interface IPostStatusFormData {
	status: PostStatusType;
}

export default function useSavePostStatus() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const axiosPrivate = useAxiosPrivate();

	// Handles making request to update the status of a post
	const savePostStatus = async (id: string, formData: IPostStatusFormData) => {
		setIsLoading(true);
		setError(null);
		let responseData;

		try {
			const response = await axiosPrivate.patch(
				`/posts/${id}/status`,
				formData
			);

			responseData = response.data;
		} catch (err: any) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}

		return responseData;
	};

	return { isLoading, error, savePostStatus };
}
