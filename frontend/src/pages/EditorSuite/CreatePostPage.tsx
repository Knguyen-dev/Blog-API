/*
+ CreatePostPage: Page for creating posts. It contains a sidebar for editing 
  and a post preview on the right side to show changes made to the post in real time.


+ Clean up the logic here:

1. Fix or maybe change the way we save the data to local storage.

2. Also front end validation for word count.


*/

import { Grid } from "@mui/material";
import { useCallback, useEffect } from "react";
import { Typography } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import useToast from "../../hooks/useToast";
import useAuthContext from "../../hooks/useAuthContext";
import useEditorContext from "./hooks/useEditorContext";
import EditPostAccordion from "./components/EditPostAccordion";

import { postActions } from "./data/postConstants";
import NewPostPreview from "../Browse/NewPostPreview";
import getCurrentDateStr from "../../utils/getCurrentDateStr";

const todayStr = getCurrentDateStr();

export default function CreatePostPage() {
	const { auth } = useAuthContext();

	const {
		state,
		dispatch,
		initialState,
		error,
		isLoading,
		onSubmitPost,
		categories,
		tags,
	} = useEditorContext();

	const { showToast } = useToast();

	const { value } = useLocalStorage("postData", initialState);

	/*
  + customDispatch: Custom dispatch function for CreatePostPage.
  Handles updating the state, but also passing a 'callback' function to our 
  reducer. This callback function will accept the new state, and update the 
  post data in local storage.

  - NOTE: Calling 'setValue' in customDispatch for the callback will cause an error as we'd 
    be trying to update a state in 'CreatePostPage whilst rendering 'EditLayout'.
    Instead, just do 'localStorage.setItem'. This will update our localStorage successfully
    and it doesn't trigger a re-render. This should be safe because we only use the postData
    inside 'value' on page load, and never again, so 'value' doesn't have to be always updated 
    with 'setValue'. 
  */
	const customDispatch = useCallback(
		(action) => {
			dispatch({
				...action,
				callback: (newState) =>
					localStorage.setItem("postData", JSON.stringify(newState)),
			});
		},
		[dispatch]
	);

	/*
  + Load unsaved post data from local storage!
  */
	useEffect(() => {
		customDispatch({ type: postActions.SET_POST, payload: value });
	}, [customDispatch, value]);

	// Handle submitting a post for the createPostPage
	const handleSubmitPost = async () => {
		// Call function to submit the post to backend
		const success = await onSubmitPost();

		// If successful, show message and clear post
		if (success) {
			showToast({
				message: "Post successfully submitted!",
				severity: "success",
			});
			dispatch({ type: postActions.SET_POST, payload: initialState });
		}
	};

	const currentCategory = categories?.find((c) => c._id === state.category);

	return (
		<div className="tw-flex tw-flex-col tw-flex-1 tw-p-5">
			<Grid
				container
				columnSpacing={4}
				className="tw-max-h-full tw-overflow-y-auto">
				<Grid item xs={12} sm={5} className="tw-h-full tw-overflow-y-auto">
					<Typography variant="h5" className="tw-text-center tw-mb-2">
						Creating New Post
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
						dispatch={customDispatch}
						// Data for post submission
						handleSubmitPost={handleSubmitPost}
						error={error}
						isLoading={isLoading}
						// Tags and categories needed for options and selections
						categories={categories}
						tags={tags}
					/>
				</Grid>
				<Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
					<NewPostPreview
						title={state.title}
						category={currentCategory}
						body={state.body}
						dateStr={todayStr}
						authorName={auth.user.fullName}
						imgSrc={state.imgSrc}
						imgCredits={state.imgCredits}
						tags={state.tags}
					/>
				</Grid>
			</Grid>
		</div>
	);
}
