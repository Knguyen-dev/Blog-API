/*
+ PostImageForm: Form fields that let the user enter in the image source of the post's 
  display image, and also the credits for the image.
*/

import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import postActions from "../../../constants/posts/postActions";

PostImageForm.propTypes = {
	imgSrc: PropTypes.string,
	imgCredits: PropTypes.string,
	dispatch: PropTypes.func,
};

export default function PostImageForm({ imgSrc, imgCredits, dispatch }) {
	return (
		<form className="tw-flex tw-flex-col tw-gap-y-4">
			<TextField
				label="Post Image"
				helperText="The src link of the image will be the thunmbnail of the post"
				value={imgSrc}
				onChange={(e) =>
					dispatch({ type: postActions.SET_IMAGE, payload: e.target.value })
				}
			/>

			<TextField
				label="Image Credits"
				helperText="Credits to the photographer of the image and platform it came from"
				value={imgCredits}
				onChange={(e) =>
					dispatch({
						type: postActions.SET_IMAGE_CREDITS,
						payload: e.target.value,
					})
				}
			/>
		</form>
	);
}
