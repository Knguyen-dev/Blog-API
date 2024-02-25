import ChangePasswordForm from "../forms/ChangePasswordForm";
import CustomDialog from "./common/CustomDialog";
import { Box, Typography, Button } from "@mui/material";
import useDialog from "../../hooks/useDialog";
export default function ChangePasswordDialog() {
	const { open, handleOpen, handleClose } = useDialog();
	const dialogText = (
		<Typography variant="span">
			After you successfully change your password, you will be logged out of the
			application. Then you will need to log in with your new password!
		</Typography>
	);
	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Change Password
			</Button>
			<CustomDialog
				modalTitle="Change Your Password!"
				dialogText={dialogText}
				CustomForm={<ChangePasswordForm />}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
