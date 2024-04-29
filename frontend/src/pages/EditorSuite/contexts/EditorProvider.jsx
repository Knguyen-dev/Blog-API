/*
+ EditorProvider: The context provider that is wrapped aorund 'EditorLayout' it's 
  responsible for providing common/shared data between the routes containing the 
  CreatePostPage and EditPostPage.

*/

import { createContext, useReducer } from "react";

import { minWordCount, postActions } from "../data/postConstants";
import useSavePost from "../hooks/useSavePost";
import useGetCategories from "../hooks/useGetCategories";
import useGetTags from "../hooks/useGetTags";
import PropTypes from "prop-types";
const EditorContext = createContext();

/*
+ postReducer: Our reducer state contains all of the closely 
  related post data. These states, except of 'wordCount' are 
  then used for controlling the controlled components in
  'EditPostAccordion', and also rendering the post in PostPreview.

*/
const postReducer = (state, action) => {
	let newState;

	switch (action.type) {
		case postActions.SET_TITLE:
			newState = { ...state, title: action.payload };
			break;
		case postActions.SET_BODY:
			newState = {
				...state,
				body: action.payload.body, // update the body html string
				wordCount: action.payload.wordCount, // update the word count
			};
			break;
		case postActions.SET_CATEGORY:
			newState = { ...state, category: action.payload };
			break;
		case postActions.SET_TAGS:
			newState = { ...state, tags: action.payload };
			break;
		case postActions.SET_IMAGE:
			newState = { ...state, imgSrc: action.payload };
			break;
		case postActions.SET_IMAGE_CREDITS:
			newState = { ...state, imgCredits: action.payload };
			break;
		case postActions.SET_STATUS:
			newState = { ...state, status: action.payload };
			break;
		case postActions.SET_POST:
			newState = action.payload;
			break;
		default:
			throw Error("Unknown action for postReducer!");
	}

	/*
  - action.callback should be a function that's passed, so if it does
    exist, call it. In the 'CreatePostPage' this function saves the 
    post to local storage. But in the EditPostPage it doesn't plan 
    to have an 'action.callback'.
  */

	if (action.callback && typeof action.callback === "function") {
		action.callback(newState);
	}
	return newState;
};

const initialState = {
	title: "",
	body: "",
	wordCount: 0, // wordCount is closely associated with 'body'
	category: null, // category id value of the selected category
	tags: [], // array of tag objects
	imgSrc: "",
	imgCredits: "",
	status: "",
};

/*
+ EditorProvider: Context provider that provides the shared variables and 
  functionality for the 'CreatePostPage' and 'EditPostPage'.
*/
const EditorProvider = ({ children }) => {
	const [state, dispatch] = useReducer(postReducer, initialState);
	const { error, setError, isLoading, submitDisabled, savePost } =
		useSavePost();

	const { categories, isLoading: categoriesLoading } = useGetCategories();
	const { tags, isLoading: tagsLoading } = useGetTags();

	const onSubmitPost = async () => {
		/*
    + General function submission function that handles the client-side
      validation, and also calls the savePost function from our hook to 
      make the api call.

    - Do client-side validation to ensure required fields are at least filled: 
    1. title: Needs to be between 1 and 100 characters; should match server-side validation and postSchema
    2. categories: Needs to be filled 
    3. status: Needs to be filled, with 'publish', 'unpublished', or 'private'.
    */

		if (state.title.length < 1 || state.title.length > 100) {
			setError("Post title needs to be between 1 and 100 characters!");
			return;
		}

		if (!state.category) {
			setError("Please pick a category for the post!");
			return;
		}

		if (!state.imgSrc) {
			setError("Please have an image for the post!");
			return;
		}

		// If true, that means a status simply wasn't selected.
		if (!state.status) {
			setError("Please pick a status for the post!");
			return;
		}

		// Front end validation on the wordCount of the post
		if (state.wordCount < minWordCount) {
			setError(`Posts need to have at least ${minWordCount} words!`);
			return;
		}

		// Format postData to only contain its ids
		const postData = {
			...state,
			tags: state.tags.map((tag) => tag._id),
		};

		const success = await savePost(postData);
		return success;
	};

	// Wait until our categories and tags are initialized before provider and children.
	// Prevents any errors in edit post accordion where we're trying to access a null value.
	if (categoriesLoading || tagsLoading) {
		return;
	}

	return (
		<EditorContext.Provider
			value={{
				categories,
				tags,
				state,
				dispatch,
				initialState,
				error,
				isLoading,
				submitDisabled,
				onSubmitPost,
			}}>
			{children}
		</EditorContext.Provider>
	);
};

EditorProvider.propTypes = {
	children: PropTypes.element,
};

export { EditorContext, EditorProvider };
