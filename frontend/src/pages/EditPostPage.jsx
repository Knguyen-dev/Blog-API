// Let them be two separate components right now until we find a solution

import { Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import useToast from "../hooks/useToast";
import postActions from "../constants/posts/postActions";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useEditorContext from "../hooks/post/useEditorContext";
import EditPostAccordion from "../components/accordion/EditPostAccordion";
import PostPreview from "../components/PostPreview";

import useAuthContext from "../hooks/user/useAuthContext";
import { useEffect } from "react";

/*
- 'Today' date could be shown as the 'Edited On' date, whilst the original
  createdAt date could be the 'Published on' date


*/
const today = new Date();

export default function EditPostPage() {
	// Get the id of the post from the route parameters
	const { id } = useParams();

	const { auth } = useAuthContext();
	const { showToast } = useToast();
	const {
		categoryList,
		tagList,
		state,
		dispatch,
		error,
		isLoading,
		submitDisabled,
		onSubmitPost,
	} = useEditorContext();
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		const abortController = new AbortController();
		const fetchPostData = async () => {
			try {
				const response = await axiosPrivate.get(`/posts/${id}`, {
					signal: abortController.signal,
				});

				/*
        - Format the postData to work with the UI. So just have 'category' be 
          an object {label, value} and 'tags' be an array of objects {label, value}

        - Store the post's id in the state as well, which will indicate to our 'savePost'
          function that we are saving changes to an existing post rather than trying to add
          a new one to the database.
        */
				const postData = {
					id: response.data._id,
					title: response.data.title,
					body: response.data.body,
					wordCount: response.data.wordCount,
					category: {
						label: response.data.category.title,
						value: response.data.category._id,
					},
					tags: response.data.tags.map((tag) => ({
						label: tag.title,
						value: tag._id,
					})),
					imgSrc: response.data.imgSrc,
					imgCredits: response.data.imgCredits,
					status: response.data.status,
				};

				dispatch({ type: postActions.SET_POST, payload: postData });
			} catch (err) {
				// If the request wasn't aborted, then a real error happened with the request
				if (!abortController.signal.aborted) {
					console.log("Failed to fetch post: ", err);
				}
			}
		};
		fetchPostData();

		return () => abortController.abort();
	}, [dispatch, axiosPrivate, id]);

	/*
  + handleSubmitPost: Submits the existing post to be updated
  
  
  */
	const handleSubmitPost = async () => {
		// Call function to submit the post
		const success = await onSubmitPost();

		/*
    - If successful, show message that the post was successfully
      updated.
    - NOTE: In this case we don't need to clear the 'state' for the post. 
    */
		if (success) {
			showToast({
				message: "Post successfully updated!",
				severity: "success",
			});
		}
	};

	return (
		<Box className="tw-flex tw-flex-col tw-flex-1 tw-p-5">
			<Grid
				container
				columnSpacing={4}
				className="tw-max-h-full tw-overflow-y-auto">
				<Grid item xs={12} sm={5} className="tw-h-full tw-overflow-y-auto">
					<Typography variant="h5" className="tw-text-center tw-mb-2">
						Editing Existing Post
					</Typography>
					<EditPostAccordion
						state={state}
						dispatch={dispatch}
						categoryList={categoryList}
						tagList={tagList}
						handleSubmitPost={handleSubmitPost}
						error={error}
						isLoading={isLoading}
						submitDisabled={submitDisabled}
					/>
				</Grid>
				<Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
					<PostPreview
						title={state.title}
						category={state.category}
						body={state.body}
						dateObj={today} // replace it with the date for the post
						authorName={auth.user.fullName} // replace it with full name of the author who wrote the post
						imgSrc={state.imgSrc}
						imgCredits={state.imgCredits}
						tags={state.tags}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
