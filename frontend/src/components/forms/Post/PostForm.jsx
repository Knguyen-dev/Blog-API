/*
+ PostForm: A set of form fields for manipulating a post's title, category, and the 
  body content of the post.
*/
import { Box, TextField } from "@mui/material";
import PostEditor from "../../Input/PostEditor";
import BasicSelect from "../../Input/BasicSelect";
import PropTypes from "prop-types";
import categoryOptions from "../../../constants/posts/categoryOptions";
import postActions from "../../../constants/posts/postActions";

export default function PostForm({ title, category, body, dispatch }) {
	const setCategory = (category) => {
		dispatch({ type: postActions.SET_CATEGORY, payload: category });
	};

	const setBody = (body) => {
		dispatch({ type: postActions.SET_BODY, payload: body });
	};

	return (
		<Box className="tw-flex tw-flex-col tw-gap-y-2">
			{/* Input fields for the form */}

			<TextField
				label="Title"
				id="title"
				name="title"
				value={title}
				onChange={(e) =>
					dispatch({ type: postActions.SET_TITLE, payload: e.target.value })
				}
			/>

			<BasicSelect
				label="Categories"
				options={categoryOptions}
				placeholder="Select a post category"
				value={category || ""}
				setValue={setCategory}
			/>

			<PostEditor value={body} setValue={setBody} />
		</Box>
	);
}
PostForm.propTypes = {
	title: PropTypes.string,
	body: PropTypes.string,
	category: PropTypes.string,
	dispatch: PropTypes.func,
};
