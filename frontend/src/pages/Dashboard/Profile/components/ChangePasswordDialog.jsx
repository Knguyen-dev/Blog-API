import { Button, Box, Typography } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import ChangePasswordForm from "./ChangePasswordForm";
import { useState } from "react";
import PropTypes from "prop-types";

ChangePasswordDialog.propTypes = {
	fullName: PropTypes.string,
};

export default function ChangePasswordDialog() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const dialogText = (
		<Typography variant="span">
			Changing your password will log you out of your account.
		</Typography>
	);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Change Password
			</Button>
			<CustomDialog
				modalTitle="Change Your Password"
				CustomForm={<ChangePasswordForm />}
				open={open}
				dialogText={dialogText}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
