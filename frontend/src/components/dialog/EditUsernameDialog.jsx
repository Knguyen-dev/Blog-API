import useDialog from "../../hooks/useDialog";
import EditUsernameForm from "../forms/EditUsernameForm";
import { Typography, Box, Button } from "@mui/material";
import CustomDialog from "./common/CustomDialog";
import PropTypes from "prop-types";

export default function EditUsernameDialog({ user }) {
	const { open, handleOpen, handleClose } = useDialog();

	/*
  - NOTE: Define a variant so that you don't get 'validateDOMNesting(...): <p> cannot appear as a descendant of <p>.'
  */
	const dialogText = (
		<Typography variant="span">
			This updates your public display name, or what other users see you as
		</Typography>
	);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit
			</Button>
			<CustomDialog
				modalTitle="Update Your Username!"
				dialogText={dialogText}
				CustomForm={
					<EditUsernameForm
						username={user.username}
						handleCloseForm={handleClose}
					/>
				}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}

EditUsernameDialog.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		fullName: PropTypes.string,
	}),
};
