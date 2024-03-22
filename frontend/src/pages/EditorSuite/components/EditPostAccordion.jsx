/*
+ EditPostAccordion: Acts as a control pnael for editing posts. Here 
  editors will be shown the various sections they can interact with to 
  edit the post that they're working on.
*/

import { useState } from "react";
import FilteredAutoSelect from "../../../components/autocomplete/FilteredAutoSelect";
import BasicAuto from "../../../components/autocomplete/BasicAuto";
import BasicSelect from "../../../components/select/BasicSelect";
import BasicAccordion from "../../../components/accordion/BasicAccordion";
import { Box, TextField, Button } from "@mui/material";

import submissionTypes from "../data/submissionOptions";
import postActions from "../data/postActions";
import PostEditor from "./PostEditor";

import PropTypes from "prop-types";

EditPostAccordion.propTypes = {
	state: PropTypes.shape({
		title: PropTypes.string,
		category: PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		}),
		body: PropTypes.string,

		tags: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.string,
			})
		),
		imgSrc: PropTypes.string,
		imgCredits: PropTypes.string,
		status: PropTypes.string,
	}),
	dispatch: PropTypes.func,
	categoryList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	tagList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	handleSubmitPost: PropTypes.func,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
	submitDisabled: PropTypes.bool,
};

export default function EditPostAccordion({
	state,
	dispatch,
	categoryList,
	tagList,
	handleSubmitPost, // Depending on whether it's the edit or create page, the function could be different
	error,
	isLoading,
	submitDisabled,
}) {
	// State that indicates the current accordion that's expanded.
	const [activeIndex, setActiveIndex] = useState(0);

	/*
  + Handles clicks on the accordion given the index position
    of said accordion
  - If clicked in an already expanded section, close the section. To
    close the section and leave all other sections closed, set index to 
    a value out of range, such as -1. Then stop function execution early.
  - Else, they are clicking on a section that is different from the opened 
    one, so just set the active index to the new index.
  */
	const handleChange = (index) => {
		if (index === activeIndex) {
			setActiveIndex(-1);
			return;
		}
		setActiveIndex(index);
	};

	// Create sections for the accordion that we'll use to render
	const sections = [
		{
			title: "Title, Category, & Body",
			content: (
				<Box className="tw-flex tw-flex-col tw-gap-y-2">
					{/* Input fields for the form */}
					<TextField
						label="Title"
						id="title"
						name="title"
						value={state.title}
						onChange={(e) =>
							dispatch({ type: postActions.SET_TITLE, payload: e.target.value })
						}
					/>

					<BasicAuto
						options={categoryList}
						onChange={(e, newCategory) =>
							dispatch({ type: postActions.SET_CATEGORY, payload: newCategory })
						}
						value={state.category}
						label="Categories"
					/>

					<PostEditor
						value={state.body}
						// 'payload' will be an object with values for {body, wordCount}
						setValue={(payload) =>
							dispatch({ type: postActions.SET_BODY, payload })
						}
					/>
				</Box>
			),
		},
		{
			title: "Tags",
			content: (
				<FilteredAutoSelect
					id="tags"
					label="Post Tags"
					placeholder="Enter tags for your post!"
					selectedValues={state.tags}
					options={tagList}
					isOption
					setSelectedValues={(newValues) =>
						dispatch({ type: postActions.SET_TAGS, payload: newValues })
					}
				/>
			),
		},
		{
			title: "Display Image",
			content: (
				<Box className="tw-flex tw-flex-col tw-gap-y-4">
					<TextField
						label="Post Image"
						helperText="The src link of the image will be the thunmbnail of the post"
						value={state.imgSrc}
						onChange={(e) =>
							dispatch({ type: postActions.SET_IMAGE, payload: e.target.value })
						}
					/>

					<TextField
						label="Image Credits"
						helperText="Credits to the photographer of the image and platform it came from"
						value={state.imgCredits}
						onChange={(e) =>
							dispatch({
								type: postActions.SET_IMAGE_CREDITS,
								payload: e.target.value,
							})
						}
					/>
				</Box>
			),
		},
		{
			title: "Submission",
			content: (
				<Box className="tw-flex tw-flex-col tw-gap-y-2">
					<BasicSelect
						label="Status"
						placeholder="Enter the submission type"
						options={submissionTypes}
						value={state.status || ""}
						setValue={(status) =>
							dispatch({ type: postActions.SET_STATUS, payload: status })
						}
					/>
					{error && <div className="error">{error}</div>}
					{/* Action Buttons for hte form */}
					<Box
						className="tw-flex tw-justify-end tw-gap-x-4"
						onClick={handleSubmitPost}>
						<Button
							variant="contained"
							color="primary"
							disabled={isLoading || submitDisabled}>
							Submit
						</Button>
					</Box>
				</Box>
			),
		},
	];

	return (
		<Box>
			{sections.map((section, index) => (
				<BasicAccordion
					key={index}
					expanded={activeIndex === index}
					handleChange={() => handleChange(index)}
					headerTitle={section.title}
					id={`accordion-${index}`}>
					{section.content}
				</BasicAccordion>
			))}
		</Box>
	);
}
