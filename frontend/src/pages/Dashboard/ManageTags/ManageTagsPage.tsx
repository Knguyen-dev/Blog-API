import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TagCard from "./components/TagCard";
import DeleteTagDialog from "./components/DeleteTagDialog";
import SaveTagDialog from "./components/SaveTagDialog";
import useGetTags from "../../EditorSuite/hooks/useGetTags";

export default function ManageTagsPage() {
	const { tags, setTags, error } = useGetTags();

	// Controls which existing tag is being selected for being edited or deleted
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	// Controls which form is active, and therefore shown on a dialog
	const [activeForm, setActiveForm] = useState<string | null>(null);

	const handleCloseDialog = () => setActiveForm(null);

	const handleCreateTag = () => {
		setActiveIndex(null); // not manipulating an existing tag
		setActiveForm("tagForm"); // make the TagForm active, allowing the user to create a tag
	};
	const handleEditTag = (index: number) => {
		setActiveIndex(index); // set index position of the tag that we're editing
		setActiveForm("tagForm"); // make tag form be the one that's being rendered.
	};

	const handleDeleteTag = (index: number) => {
		setActiveIndex(index); // set the index position of the tag we're deleting
		setActiveForm("deleteTag"); // make the delete tag dialog appear
	};

	// If activeIndex is a defined number (a tag is selected) and we have our tags, get our selected tag
	let selectedTag = null;
	if (tags && activeIndex !== null) {
		selectedTag = tags[activeIndex];
	}

	return (
		<Box>
			<Box component="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Tags
				</Typography>
				<Button variant="contained" onClick={handleCreateTag}>
					Create Tag
				</Button>
			</Box>

			{selectedTag && activeForm === "tagForm" && (
				<SaveTagDialog
					selectedTag={selectedTag}
					setTags={setTags}
					open={true}
					handleClose={handleCloseDialog}
				/>
			)}

			{selectedTag && activeForm === "deleteTag" && (
				<DeleteTagDialog
					selectedTag={selectedTag}
					setTags={setTags}
					open={true}
					handleClose={handleCloseDialog}
				/>
			)}

			<Box>
				{tags ? (
					tags.length > 0 ? (
						<Box
							className="tw-grid tw-gap-1"
							sx={{
								gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
							}}>
							{tags.map((tag, index) => (
								<TagCard
									key={tag._id}
									tag={tag}
									handleDelete={() => handleDeleteTag(index)}
									handleEdit={() => handleEditTag(index)}
								/>
							))}
						</Box>
					) : (
						<Typography>No tags found! Please create some new tags!</Typography>
					)
				) : error ? (
					<Typography>Error: {error}</Typography>
				) : (
					<Typography variant="h4">Loading in tags...</Typography>
				)}
			</Box>
		</Box>
	);
}
