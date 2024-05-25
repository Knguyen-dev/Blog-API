import TagForm from "./TagForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

SaveTagDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	selectedTag: PropTypes.object,
	setTags: PropTypes.func.isRequired,
};
export default function SaveTagDialog({
	open,
	handleClose,
	selectedTag,
	setTags,
}) {
	const dialogText = (
		<Typography variant="span">
			{selectedTag
				? `Edit the title of the existing tag named '${selectedTag.title}'. 
        Any posts that already have this tag will show the tag's new title!`
				: "Add a new tag that can be placed onto existing posts!"}
		</Typography>
	);

	return (
		<CustomDialog
			modalTitle={selectedTag ? "Edit existing tag" : "Create new tag"}
			CustomForm={
				<TagForm
					selectedTag={selectedTag}
					setTags={setTags}
					onSuccess={handleClose}
				/>
			}
			open={open}
			dialogText={dialogText}
			handleClose={handleClose}
		/>
	);
}
