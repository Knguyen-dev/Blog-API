import AlertDialog from "./common/AlertDialog";
import { DialogActions, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

import useDialog from "../../hooks/useDialog";

/*
- DeleteAvatarDialog: Dialog that shows up that will prompt the user for confirmation
  on whether or not they want to delete their current avatar. We're passed in the 
  parameters isLoading, and changeAvatar from 'AvatarForm' component. As a result,
  any errors from deleting an avatar will be shown on the AvatarForm.
*/
export default function DeleteAvatarDialog({ isLoading, changeAvatar }) {
	const { open, handleOpen, handleClose } = useDialog();

	/*
  + Handle dialog confirmation:
  1. Close dialog
  2. Call changeAvatar, without passing in file, which means we want to delete
    the avatar.
  */
	const onConfirm = async () => {
		handleClose();
		await changeAvatar();
	};

	const actions = (
		<DialogActions>
			<Button onClick={handleClose}>Close</Button>
			<Button disabled={isLoading} onClick={onConfirm}>
				Confirm
			</Button>
		</DialogActions>
	);

	const dialogText = (
		<Typography variant="span">
			By agreeing, you confirm that you are permanently deleting your avatar
			from your account. Note that we have no means to help you recover your
			avatar after you delete it!
		</Typography>
	);

	return (
		<>
			<Button variant="contained" color="warning" onClick={handleOpen}>
				Delete Avatar
			</Button>
			<AlertDialog
				open={open}
				title="Delete Your Avatar?"
				handleClose={handleClose}
				dialogActions={actions}
				dialogText={dialogText}
			/>
		</>
	);
}
DeleteAvatarDialog.propTypes = {
	isLoading: PropTypes.bool,
	changeAvatar: PropTypes.func,
};
