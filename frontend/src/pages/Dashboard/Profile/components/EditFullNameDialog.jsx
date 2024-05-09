import { Button, Box } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import EditFullNameForm from "./EditFullNameForm";
import { useState } from "react";
import PropTypes from "prop-types";

EditFullNameDialog.propTypes = {
	fullName: PropTypes.string,
};

export default function EditFullNameDialog({ fullName }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Name
			</Button>
			<CustomDialog
				modalTitle="Edit Your Name"
				CustomForm={
					<EditFullNameForm fullName={fullName} onSuccess={handleClose} />
				}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
