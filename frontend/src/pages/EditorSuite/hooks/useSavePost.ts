import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import DOMPurify from "dompurify";
import handleRequestError from "../../../utils/handleRequestError";

import { IPostFormData } from "../../../types/Post";

export default function useSavePost() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();

	const saveExistingPost = (postData: IPostFormData) => {
		return axiosPrivate.patch(`/posts/${postData._id}`, postData);
	};

	const createNewPost = (postData: IPostFormData) => {
		return axiosPrivate.post("/posts", postData);
	};

	// Will either call addNewPost or saveExistingPost depending on whether we have
	// an existing postID or not.
	const savePost = async (postData: IPostFormData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			// Sanitize the html on the front end.
			postData.body = DOMPurify.sanitize(postData.body);

			if (postData._id) {
				await saveExistingPost(postData);
			} else {
				await createNewPost(postData);
			}

			// Mark operation as successful!
			success = true;
		} catch (err: any) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}
		// Return whether or not the operation was successful
		return success;
	};

	return {
		error,
		setError,
		isLoading,
		savePost,
	};
}
