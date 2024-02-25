import EditEmailForm from "../forms/EditEmailForm";
import { Box, Typography, Button } from "@mui/material";
import useDialog from "../../hooks/useDialog";
import PropTypes from "prop-types";
import CustomDialog from "./common/CustomDialog";
export default function EditEmailDialog({ user }) {
	const { open, handleOpen, handleClose } = useDialog();

	const dialogText = (
		<Typography variant="span">
			Note that changing your email does not require you to verify your email!
			This will be changed later in BlogSphere&apos;s next update!
		</Typography>
	);
	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit
			</Button>
			<CustomDialog
				btnText="Edit"
				modalTitle="Update Your Email!"
				dialogText={dialogText}
				CustomForm={
					<EditEmailForm email={user.email} handleCloseForm={handleClose} />
				}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}

EditEmailDialog.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		fullName: PropTypes.string,
	}),
};
