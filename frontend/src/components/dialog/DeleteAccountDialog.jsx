import DeleteAccountForm from "../forms/DeleteAccountForm";
import { Box, Button, Typography } from "@mui/material";
import CustomDialog from "./common/CustomDialog";
import useDialog from "../../hooks/useDialog";

export default function DeleteAccountDialog() {
	const { open, handleOpen, handleClose } = useDialog();
	const dialogText = (
		<Typography variant="span">
			Warning you are about to permanently delete your account! Once you confirm
			it we have no way of helping you get it back. Note that on confirmation
			you will be redirected back to the login page!
		</Typography>
	);

	return (
		<Box>
			<Button color="warning" variant="outlined" onClick={handleOpen}>
				Delete Account
			</Button>
			<CustomDialog
				modalTitle="Account Deletion!"
				dialogText={dialogText}
				CustomForm={<DeleteAccountForm />}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
