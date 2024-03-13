import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import DOMPurify from "dompurify";
import useSubmitDisabled from "../user/useSubmitDisabled";
/*
- Note that DOMPurify allows svgs whilst TinyMce does not. So I don't think
  that should pose a problem as 
*/

const addNewPointEndpoint = "/posts";
const saveExistingPostEndpoint = "/posts/:id";

export default function useSavePost() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled();

	const addNewPost = async () => {};

	const saveExistingPost = async () => {};

	// Will either call addNewPost or saveExistingPost depending on whether we have
	// an existing postID or not.
	const savePost = async (postData) => {
		setIsLoading(true);
		setError(null);

		try {
			// Sanitize the html
			postData.body = DOMPurify.sanitize(postData.body);

			let response = null;

			// If we have an id, that means we're saving changes to an existing post
			if (postData.id) {
				response = await saveExistingPost(postData);
			} else {
				// No id so we're adding a completely new post to the database
				response = await addNewPost(postData);
			}

			// Response data will contain the saved post that is in the database.
			return response.data;
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(err?.response?.data?.message || "Server error occurred!");
			} else if (err.request) {
				setError("Network Error!");
			} else {
				setError("Something unexpected happened!");
			}
		}
	};
}
