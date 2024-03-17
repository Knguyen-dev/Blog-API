/*
+ CreatePostPage: Page for creating posts. It contains a sidebar for editing 
  and a post preview on the right side to show changes made to the post in real time.
*/
import EditPostAccordion from "../components/accordion/EditPostAccordion";
import postActions from "../constants/posts/postActions";
import { Grid } from "@mui/material";
import { useCallback } from "react";
import { Typography } from "@mui/material";
import PostPreview from "../components/PostPreview";
import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useToast from "../hooks/useToast";
import useAuthContext from "../hooks/user/useAuthContext";

// import { useEditorContext } from "../layouts/EditorLayout";
import useEditorContext from "../hooks/post/useEditorContext";

const today = new Date();

export default function CreatePostPage() {
	const { auth } = useAuthContext();

	const {
		categoryList,
		tagList,
		state,
		dispatch,
		initialState,
		error,
		isLoading,
		submitDisabled,
		onSubmitPost,
	} = useEditorContext();

	const { showToast } = useToast();

	const { value } = useLocalStorage("postData", initialState);

	/*
  + customDispatch: Custom dispatch function for CreatePostPage.
  - Handles state updates differently in CreatePostPage and EditPostPage.
  - Saves unsaved post data in 'postData' key for new posts.

  2. customDispatch is a dependency of useEffect, so we memoize it to prevent useEffect
    from running on every render.

  3. Calling 'setValue' in customDispatch for the callback will cause an error as we'd 
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

	const handleSubmitPost = async () => {
		// Call function to submit the post
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
						state={state}
						dispatch={customDispatch}
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
						category={state.category} // 'category' is an id, get the human-readable title
						body={state.body}
						dateObj={today}
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
