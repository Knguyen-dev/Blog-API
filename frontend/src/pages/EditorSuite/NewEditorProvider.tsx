/*
+ What?
Creates a new editor provider. Provide only categories, tags
(and their related states). Also provide the onSubmitPost
which is the function that we'll use to submit any type of post.
Well pass it its error, isLoading, and onSubmitPost states as well.
This is good since the validation is all there, no need for two separate functions.

+ Why?
Let's keep the state containing the post's data separate in each page rather 
than up here. It's not like their states carry over on each component so 
there's no need to lift up. Also I think this can make it a little easier handling
the CreatePostPage and EditPostPage.
*/

import { ReactNode, createContext } from "react";
import useGetCategories from "./hooks/useGetCategories";
import useGetTags from "./hooks/useGetTags";
import { minWordCount } from "./postConstants";
import useSavePost from "./hooks/useSavePost";
import { Box, Typography } from "@mui/material";
import { ICategory, IPostState, ITag, IPostFormData } from "../../types/Post";

interface INewEditorProviderProps {
	children: ReactNode;
}
interface INewEditorContextType {
	categories: ICategory[];
	categoriesError: string | null;
	tags: ITag[];
	tagsError: string | null;
	submitLoading: boolean;
	submitError: string | null;
	onSubmitPost: (state: IPostState) => Promise<boolean>;
}
export const NewEditorContext = createContext<
	INewEditorContextType | undefined
>(undefined);

export default function NewEditorProvider({
	children,
}: INewEditorProviderProps) {
	const { categories, error: categoriesError } = useGetCategories();
	const { tags, error: tagsError } = useGetTags();
	const {
		error: submitError,
		setError: setSubmitError,
		isLoading: submitLoading,
		savePost,
	} = useSavePost();

	const onSubmitPost = async (state: IPostState) => {
		/*
		+ General function submission function that handles the client-side
			validation, and also calls the savePost function from our hook to 
			make the api call. Here you can get 'IPostData' which is the object 
      you can when the user is creating a new post, or IPost, which is the post object
      for an existing post (has a little extra data in it).

		- Do client-side validation to ensure required fields are at least filled: 
		1. title: Needs to be between 1 and 100 characters; should match server-side validation and postSchema
		2. categories: Needs to be filled 
		3. status: Needs to be filled, with 'publish', 'unpublished', or 'private'.
		*/

		if (state.title.length < 1 || state.title.length > 100) {
			setSubmitError("Post title needs to be between 1 and 100 characters!");
			return false;
		}

		if (!state.category) {
			setSubmitError("Please pick a category for the post!");
			return false;
		}

		if (!state.imgSrc) {
			setSubmitError("Please have an image for the post!");
			return false;
		}

		// If true, that means a status simply wasn't selected.
		if (!state.status) {
			setSubmitError("Please pick a status for the post!");
			return false;
		}

		// Front end validation on the wordCount of the post
		if (state.wordCount < minWordCount) {
			setSubmitError(`Posts need to have at least ${minWordCount} words!`);
			return false;
		}

		if (!state.imgCredits) {
			setSubmitError(
				"Posts need to include image credits before you can submit them!"
			);
			return false;
		}

		// Format data so that it's ready for api call
		const postData: IPostFormData = {
			title: state.title,
			body: state.body,
			wordCount: state.wordCount,
			category: state.category._id,
			tags: state.tags.map((tag: ITag) => tag._id),
			imgSrc: state.imgSrc,
			imgCredits: state.imgCredits,
			status: state.status,
		};

		return await savePost(postData);
	};

	// Error handling for getting categories and tags
	if (categoriesError) {
		return (
			<Box>
				{categoriesError && (
					<Typography>Error getting categories: {categoriesError}</Typography>
				)}
			</Box>
		);
	}

	// Do same error catching process for tags Error
	if (tagsError) {
		return (
			<Box>
				{tagsError && <Typography>Error getting tags: {tagsError}</Typography>}
			</Box>
		);
	}

	/*
  - Don't render if we still don't have or categories or tags
  NOTE: Prevents errors from trying to access null as an array/defined value
  */
	if (!categories || !tags) {
		return;
	}

	return (
		<NewEditorContext.Provider
			value={{
				categories,
				categoriesError,
				tags,
				tagsError,
				submitLoading,
				submitError,
				onSubmitPost,
			}}>
			{children}
		</NewEditorContext.Provider>
	);
}
