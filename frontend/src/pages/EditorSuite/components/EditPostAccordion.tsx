/*
+ EditPostAccordion: Acts as a control pnael for editing posts. Here 
  editors will be shown the various sections they can interact with to 
  edit the post that they're working on.
*/

import { useState } from "react";

import NewBasicSelect from "../../../components/select/NewBasicSelect";
import FilteredAutoSelect from "../../../components/autocomplete/FilteredAutoSelect";
import BasicAccordion from "../../../components/accordion/BasicAccordion";
import { Box, TextField, Button } from "@mui/material";
import { postActions, postStatuses } from "../data/postConstants";
import PostEditor from "./PostEditor";
import { ICategory, ITag, PostStatusType } from "../../../types/Post";


interface IEditPostAccordion {
	title: string;
	cateogry: string;
	body: string;
	selectedTags: ITag[];
	imgSrc: string;
	imgCredits: string;
	// dispatch:
	// handleSubmitPost
	status: PostStatusType;
	error: string;
	isLoading: boolean;
	categories: ICategory[];
	tags: ITag[];

}


export default function EditPostAccordion({
	title,
	category,
	body,
	selectedTags,
	imgSrc,
	imgCredits,
	status,
	dispatch,
	handleSubmitPost, // Depending on whether it's the edit or create page, the function could be different
	error,
	isLoading,
	categories,
	tags,
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
						value={title}
						onChange={(e) =>
							dispatch({ type: postActions.SET_TITLE, payload: e.target.value })
						}
						required
					/>

					<NewBasicSelect
						value={category || ""}
						setValue={(newCategory) =>
							dispatch({ type: postActions.SET_CATEGORY, payload: newCategory })
						}
						options={categories || []}
						getOptionLabel={(option) => option.title}
						getOptionValue={(option) => option._id}
						label="Category"
						placeholder="Select a category for the post"
						required
					/>

					<PostEditor
						value={body}
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
					placeholder="Select Tags"
					options={tags}
					selectedValues={selectedTags}
					setSelectedValues={(newValues) =>
						dispatch({ type: postActions.SET_TAGS, payload: newValues })
					}
					getOptionLabel={(option) => option.title}
					isOptionEqualToValue={(option, value) => option._id === value._id}
					limitTags={3}
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
						value={imgSrc}
						onChange={(e) =>
							dispatch({ type: postActions.SET_IMAGE, payload: e.target.value })
						}
						required
					/>

					<TextField
						label="Image Credits"
						name="imgCredits"
						helperText="Credits to the photographer of the image and platform it came from"
						value={imgCredits}
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
					<NewBasicSelect
						value={status || ""}
						setValue={(status) =>
							dispatch({ type: postActions.SET_STATUS, payload: status })
						}
						label="Status"
						options={postStatuses}
						getOptionLabel={(option) => option.label}
						getOptionValue={(option) => option.value}
						placeholder="Select a status for the post"
						required
					/>

					{error && <div className="error">{error}</div>}
					{/* Action Buttons for the form */}
					<Box
						className="tw-flex tw-justify-end tw-gap-x-4"
						onClick={handleSubmitPost}>
						<Button variant="contained" color="primary" disabled={isLoading}>
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
