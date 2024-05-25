import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TagCard from "./components/TagCard";
import DeleteTagDialog from "./components/DeleteTagDialog";
import SaveTagDialog from "./components/SaveTagDialog";
import useGetTags from "../../EditorSuite/hooks/useGetTags";

export default function ManageTagsPage() {
	const { tags, setTags, isLoading, error } = useGetTags();

	const [activeIndex, setActiveIndex] = useState(null);
	const [activeForm, setActiveForm] = useState(null);

	const handleCloseDialog = () => setActiveForm(null);
	const handleCreateTag = () => {
		setActiveIndex(null);
		setActiveForm("tagForm");
	};
	const handleEditTag = (index) => {
		setActiveIndex(index);
		setActiveForm("tagForm");
	};
	const handleDeleteTag = (index) => {
		setActiveIndex(index);
		setActiveForm("deleteTag");
	};

	const selectedTag = activeIndex !== null ? tags[activeIndex] : null;

	return (
		<Box>
			<Box variant="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Tags
				</Typography>
				<Button variant="contained" onClick={handleCreateTag}>
					Create Tag
				</Button>
			</Box>

			<SaveTagDialog
				selectedTag={selectedTag}
				setTags={setTags}
				open={activeForm === "tagForm"}
				handleClose={handleCloseDialog}
			/>

			<DeleteTagDialog
				selectedTag={selectedTag}
				setTags={setTags}
				open={activeForm === "deleteTag"}
				handleClose={handleCloseDialog}
			/>

			<Box>
				{isLoading ? (
					<Typography>Loading tags...</Typography>
				) : error ? (
					<Typography>Error: {error.message}</Typography>
				) : tags.length === 0 ? (
					<Typography>No tags have been created. Please make a tag!</Typography>
				) : (
					<Box
						className="tw-grid tw-gap-1"
						sx={{
							gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
						}}>
						{tags.map((tag, index) => (
							<TagCard
								key={index}
								tag={tag}
								handleDelete={() => handleDeleteTag(index)}
								handleEdit={() => handleEditTag(index)}
							/>
						))}
					</Box>
				)}
			</Box>
		</Box>
	);
}
