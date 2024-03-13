/*
+ EditPostAccordion: Acts as a control pnael for editing posts. Here 
  editors will be shown the various sections they can interact with to 
  edit the post that they're working on.
*/

import { useState } from "react";

import PostForm from "../forms/Post/PostForm";
import FilteredAutoSelect from "../autocomplete/common/FilteredAutoSelect";
import PostImageForm from "../forms/Post/PostImageForm";
import SubmitPostArea from "../forms/Post/SubmitPostArea";
import BasicAccordion from "./common/BasicAccordion";
import postActions from "../../constants/posts/postActions";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

EditPostAccordion.propTypes = {
	title: PropTypes.string,
	setTitle: PropTypes.func,
	category: PropTypes.string,
	tags: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	imgSrc: PropTypes.string,
	imgCredits: PropTypes.string,
	body: PropTypes.string,
	status: PropTypes.string,
	dispatch: PropTypes.func,
};

// Fake tags: Probably here you'd call the effect to get the available tags
const tagOptions = [
	{
		label: "Trending",
		value: "Trending",
	},
	{
		label: "Opinion",
		value: "Opinion",
	},
	{
		label: "Analysis",
		value: "Analysis",
	},
	{
		label: "Streaming",
		value: "Streaming",
	},
	{
		label: "Popular Culture",
		value: "Popular Culture",
	},
	{
		label: "Controversy",
		value: "Controversy",
	},
	{
		label: "Politics",
		value: "Politics",
	},
];

export default function EditPostAccordion({
	title,
	category,
	body,
	tags,
	imgSrc,
	imgCredits,
	status,
	dispatch,
}) {
	// State that indicates the current accordion that's expanded.
	const [activeIndex, setActiveIndex] = useState(0);

	// Create sections for the accordion that we'll use to render
	const sections = [
		{
			title: "Title, Category, & Body",
			content: (
				<PostForm
					title={title}
					category={category}
					body={body}
					dispatch={dispatch}
				/>
			),
		},
		{
			title: "Tags",
			content: (
				<FilteredAutoSelect
					id="tags"
					label="Post Tags"
					placeholder="Enter tags for your post!"
					options={tagOptions}
					isOption
					selectedValues={tags}
					setSelectedValues={(newValues) =>
						dispatch({ type: postActions.SET_TAGS, payload: newValues })
					}
				/>
			),
		},
		{
			title: "Display Image",
			content: (
				<PostImageForm
					imgSrc={imgSrc}
					imgCredits={imgCredits}
					dispatch={dispatch}
				/>
			),
		},
		{
			title: "Submission",
			content: <SubmitPostArea status={status} dispatch={dispatch} />,
		},
	];
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
