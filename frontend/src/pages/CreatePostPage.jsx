/*
+ CreatePostPage: Page for creating posts. It contains a sidebar for editing 
  and a post preview on the right side to show changes made to the post in real time.
*/
import EditPostAccordion from "../components/accordion/EditPostAccordion";
import postActions from "../constants/posts/postActions";
import { Grid } from "@mui/material";
import { useReducer } from "react";
import { Typography } from "@mui/material";
import PostPreview from "../components/PostPreview";
import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
const today = new Date();

const authorName = "Kevin Nguyen";

const postReducer = (state, action) => {
	let newState;

	switch (action.type) {
		case postActions.SET_TITLE:
			newState = { ...state, title: action.payload };
			break;
		case postActions.SET_BODY:
			newState = { ...state, body: action.payload };
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

	// Store post in local storage and return it.
	localStorage.setItem("postData", JSON.stringify(newState));
	return newState;
};

const initialState = {
	title: "",
	body: "",
	category: "",
	tags: [],
	imgSrc: "",
	imgCredits: "",
	status: "",
};

export default function CreatePostPage() {
	const [state, dispatch] = useReducer(postReducer, initialState);
	const { value } = useLocalStorage("postData", initialState);

	/*
  - On initial load, apply what we got from local storage. If we got something
    we set the state to that something, else it would stay the initialState.
  */

	useEffect(() => {
		dispatch({ type: postActions.SET_POST, payload: value });
	}, [value]);

	return (
		<div className="tw-flex tw-flex-col tw-flex-1 tw-p-5">
			<Grid
				container
				columnSpacing={4}
				className="tw-max-h-full tw-overflow-y-auto">
				<Grid item xs={12} sm={5} className="tw-h-full tw-overflow-y-auto">
					<Typography variant="h5" className="tw-text-center tw-mb-2">
						Edit Panel
					</Typography>
					<EditPostAccordion
						title={state.title}
						category={state.category}
						body={state.body}
						tags={state.tags}
						imgSrc={state.imgSrc}
						imgCredits={state.imgCredits}
						status={state.status}
						dispatch={dispatch}
					/>
				</Grid>
				<Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
					<PostPreview
						title={state.title}
						category={state.category}
						body={state.body}
						dateObj={today}
						authorName={authorName}
						imgSrc={state.imgSrc}
						imgCredits={state.imgCredits}
						tags={state.tags}
					/>
				</Grid>
			</Grid>
		</div>
	);
}
