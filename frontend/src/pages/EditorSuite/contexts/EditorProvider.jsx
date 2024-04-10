/*
+ EditorProvider: The context provider that is wrapped aorund 'EditorLayout' it's 
  responsible for providing common/shared data between the routes containing the 
  CreatePostPage and EditPostPage.

*/

import { createContext, useState, useEffect, useReducer } from "react";
import postActions from "../data/postActions";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useSavePost from "../hooks/useSavePost";

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
	category: null, // category object
	tags: [], // array of tag objects
	imgSrc: "",
	imgCredits: "",
	status: "",
};

/*
+ EditorProvider: Context provider that provides the shared variables and 
  functionality for the 'CreatePostPage' and 'EditPostPage'


*/
const EditorProvider = ({ children }) => {
	const axiosPrivate = useAxiosPrivate();
	const [state, dispatch] = useReducer(postReducer, initialState);
	const { error, setError, isLoading, submitDisabled, savePost } =
		useSavePost();
	/*
  + States
  - Arrays of categories and tags that are valid for the editor to 
    use in their post. Each category or tag is an object 
    {
      label: title of the category or tag
      value: database id of the category or tag
    }
  */
	const [categoryList, setCategoryList] = useState([]);
	const [tagList, setTagList] = useState([]);

	// Effect loads in and sets the array of categories and tags
	useEffect(() => {
		const abortController = new AbortController();

		const fetchTags = async () => {
			try {
				const response = await axiosPrivate.get("/tags", {
					signal: abortController.signal,
				});

				const tagList = response.data.map((tag) => ({
					// Have a label and value for each tag to work with the autocomplete
					label: tag.title,
					value: tag._id,
				}));

				setTagList(tagList);
			} catch (err) {
				if (err.name !== "CanceledError") {
					console.error("Error fetching categories:", err);
				}
			}
		};

		const fetchCategories = async () => {
			try {
				const response = await axiosPrivate.get("/categories", {
					signal: abortController.signal,
				});

				const categoryList = response.data.map((category) => ({
					// Have a label and value for each tag to work with BasicSelect
					label: category.title,
					value: category._id,
				}));

				setCategoryList(categoryList);
			} catch (err) {
				if (err.name !== "CanceledError") {
					console.error("Error fetching categories:", err);
				}
			}
		};

		// You'll want this to trigger a re-render
		fetchCategories();
		fetchTags();

		return () => abortController.abort();
	}, [axiosPrivate]);

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

		// Format postData to only contain its ids
		const postData = {
			...state,
			category: state.category.value,
			tags: state.tags.map((tag) => tag.value),
		};

		// Call function to save post and indicate we're creating a new post
		const success = await savePost(postData);

		// return 'success' flag. The CreatePostPage and EditPostPage
		// will have their logic for showing the success
		return success;
	};

	return (
		<EditorContext.Provider
			value={{
				categoryList,
				tagList,
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
