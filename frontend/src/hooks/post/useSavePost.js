import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import DOMPurify from "dompurify";
import useSubmitDisabled from "../user/useSubmitDisabled";
/*
- Note that DOMPurify allows svgs whilst TinyMce does not. So I don't think
  that should pose a problem as 
*/

export default function useSavePost() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const saveExistingPost = (postData) => {
		return axiosPrivate.patch(`/posts/${postData.id}`, postData);
	};

	const createNewPost = (postData) => {
		return axiosPrivate.post("/posts", postData);
	};

	// Will either call addNewPost or saveExistingPost depending on whether we have
	// an existing postID or not.
	const savePost = async (postData) => {
		setIsLoading(true);
		setError(null);
		let success = false;

		try {
			// Sanitize the html on the front end.
			postData.body = DOMPurify.sanitize(postData.body);

			// If 'id' property exists, we are saving changes to an existing post.
			if (postData.id) {
				await saveExistingPost(postData);
			} else {
				await createNewPost(postData);
			}

			// Mark operation as successful!
			success = true;
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(err.response.data?.error?.message);
			} else if (err.request) {
				setError("Network Error!");
			} else {
				setError("Something unexpected happened!");
			}
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
		submitDisabled,
		savePost,
	};
}
