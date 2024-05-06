import { Box, Grid, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useToast from "../../hooks/useToast";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useEditorContext from "./hooks/useEditorContext";

import { postActions } from "./data/postConstants";
import EditPostAccordion from "./components/EditPostAccordion";
import getErrorData from "../../utils/getErrorData";
import NewPostPreview from "../Browse/NewPostPreview";

export default function EditPostPage() {
	// Get the id of the post from the route parameters
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const { state, dispatch, error, isLoading, onSubmitPost, categories, tags } =
		useEditorContext();
	const axiosPrivate = useAxiosPrivate();

	const [postError, setPostError] = useState(null);

	// Effect that loads existing data for a post!
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

					// Helps protect in cases where category was deleted
					category: response.data.category?._id,
					tags: response.data.tags,
					imgSrc: response.data.imgSrc,
					imgCredits: response.data.imgCredits,
					status: response.data.status,
					authorName: response.data.user.fullName,
					createdAt: response.data.createdAt,
				};
				dispatch({ type: postActions.SET_POST, payload: postData });
			} catch (err) {
				// If the request wasn't aborted, then a real error happened with the request
				if (!abortController.signal.aborted) {
					console.log("Failed to fetch post: ", err);
					setPostError(getErrorData(err));

					if (err.response.status === 404) navigate("/not-found");
				}
			}
		};
		fetchPostData();
		return () => abortController.abort();
	}, [dispatch, axiosPrivate, navigate, id]);

	// handleSubmitPost: Submits the existing post to be updated
	const handleSubmitPost = async () => {
		const success = await onSubmitPost();
		if (success) {
			showToast({
				message: "Post successfully updated!",
				severity: "success",
			});
		}
	};

	const currentCategory = categories.find((c) => c._id === state.category);

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
						// Data for the posts
						title={state.title}
						body={state.body}
						category={state.category}
						selectedTags={state.tags}
						imgSrc={state.imgSrc}
						imgCredits={state.imgCredits}
						status={state.status}
						// Updates the data states
						dispatch={dispatch}
						// Data for post submission
						handleSubmitPost={handleSubmitPost}
						error={error}
						isLoading={isLoading}
						// categories and tags needed
						categories={categories}
						tags={tags}
					/>
				</Grid>
				<Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
					{/* Only render once we have the data. We can do this by checking one of the properties of 
          the state to be truthy. We will check 'authorName' since that is truthy when we actually got
          a post, and the user can't make it falsy. We don't is a 'isLoading' state because if isLoading=false,
          our post's data could still be undefined or falsy. Take 'dateStr', it needs to be an ISOformat string, and we 
          only know it meets this criteria when we get the post's data, state.authorName defined. IF we used isLoading, 
          due to the async nature of state updates, it could still be an empty string/invalid, causing an error.*/}
					{state.authorName ? (
						<NewPostPreview
							title={state.title}
							category={currentCategory}
							body={state.body}
							dateStr={state.createdAt}
							authorName={state.authorName}
							imgSrc={state.imgSrc}
							imgCredits={state.imgCredits}
							tags={state.tags}
						/>
					) : postError ? (
						<Typography>{error}</Typography>
					) : (
						<Typography>Loading in the post!</Typography>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
