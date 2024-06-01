import { Box, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useToast from "../../hooks/useToast";
import { IPost, IPostState } from "../../types/Post";
import useNewEditorContext from "./hooks/useNewEditorContext";
import EditPostAccordion from "./components/EditPostAccordion";
import NewPostPreview from "../Browse/NewPostPreview";
import usePrivateFetchData from "../../hooks/usePrivateFetchData";
import { useState, useEffect } from "react";
import { initialPostState } from "./postConstants";

// Converts an IPost object into an IPostState object
const convertToPostState = (post: IPost): IPostState => ({
	title: post.title,
	body: post.body,
	wordCount: post.wordCount,
	category: post.category,
	tags: post.tags,
	imgSrc: post.imgSrc,
	imgCredits: post.imgCredits,
	status: post.status,
	authorName: post.user.fullName,
	createdAt: post.createdAt,
	_id: post._id,
});

export default function EditPostPage() {
	const { id } = useParams(); // id of the post
	const { showToast } = useToast();
	const { categories, tags, submitLoading, submitError, onSubmitPost } =
		useNewEditorContext();

	// States for fetching the existing post from the backend
	const {
		data: postData,
		error: postError,
	} = usePrivateFetchData<IPost>(`/posts/${id}`);

	/*
  - State for controlling the post's info whilst it changes due to user input

  NOTE: We will initially populate this state with an initial value. This value will
  won't be used and will be overwritten as soon as 'postData' is loaded. The reason 
  that we populate postState with this unused initial in the first place is so that the 
  when we pass 'setPostState' into 'setPostData', it's of type Dispatch<SetActionState<IPostState>>.
  */
	const [postState, setPostState] = useState<IPostState>(initialPostState);

	// When 'postData' is found, populate 'postState' state
	useEffect(() => {
		if (postData) {
			setPostState(convertToPostState(postData));
		}
	}, [postData]);

	// handleSubmitPost: Submits the existing post to be updated
	const handleSubmitPost = async () => {
		// For type-checking; in reality if postData is undefined the submission button won't render
		if (!postState) {
			return;
		}
		const success = await onSubmitPost(postState);
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
					{postState && (
						<EditPostAccordion
							postData={postState}
							setPostData={setPostState}
							// Tags and categories needed for options and selections
							categories={categories}
							tags={tags}
							// Data for post submission
							onSubmitPost={handleSubmitPost}
							submitError={submitError}
							submitLoading={submitLoading}
						/>
					)}
				</Grid>
				<Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
					{/* Only render once we have the data. We can do this by checking one of the properties of 
          the state to be truthy. We will check 'authorName' since that is truthy when we actually got
          a post, and the user can't make it falsy. We don't is a 'isLoading' state because if isLoading=false,
          our post's data could still be undefined or falsy. Take 'dateStr', it needs to be an ISOformat string, and we 
          only know it meets this criteria when we get the post's data, state.authorName defined. IF we used isLoading, 
          due to the async nature of state updates, it could still be an empty string/invalid, causing an error.*/}
					{postState ? (
						<NewPostPreview
							title={postState.title}
							category={postState.category}
							body={postState.body}
							dateStr={postState.createdAt}
							authorName={postState.authorName}
							imgSrc={postState.imgSrc}
							imgCredits={postState.imgCredits}
							tags={postState.tags}
						/>
					) : postError ? (
						<Typography>{postError}</Typography>
					) : (
						<Typography>Loading in the post!</Typography>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}
