import AlertDialog from "../../../../components/dialog/AlertDialog";
import { DialogActions, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import useRemoveEmployee from "../hooks/useRemoveEmployee";
import { IUser } from "../../../../types/Post";

interface IRemoveEmployeeDialogProps {
	open: boolean;
	handleClose: () => void;
	targetUser: IUser
}

/*
- RemoveEmployeeDialog: Dialog that asks for confirmation before you remove
  a user as an employee.
*/
export default function RemoveEmployeeDialog({
	open,
	handleClose,
	targetUser,
} : IRemoveEmployeeDialogProps) {
	const { error, isLoading, removeEmployee } = useRemoveEmployee();

	// The onSubmit function basically
	const onConfirm = async () => {
		const success = await removeEmployee(targetUser._id);

		// If successful close dialog, else there were errors so leave dialog open
		// so that the error can see them.
		if (success) {
			handleClose();
		}
	};

	const actions = (
		<DialogActions sx={{ display: "flex", flexDirection: "column" }}>
			<Box sx={{ alignSelf: "end", marginTop: 2 }}>
				<Button
					variant="outlined"
					onClick={handleClose}
					sx={{ marginRight: 2 }}>
					Close
				</Button>
				<Button
					variant="contained"
					color="warning"
					disabled={isLoading}
					onClick={onConfirm}>
					Confirm Deletion
				</Button>
			</Box>

			{error && (
				<Box sx={{ marginTop: 2 }} className="error">
					{error}
				</Box>
			)}
		</DialogActions>
	);

	const dialogText = (
		<Typography>
			Do you want to confirm removing user &apos;{targetUser.username}&apos; AKA
			&apos;{targetUser.fullName}&apos; as an employee? Removing this user as an
			employee will delete their account and all posts associated with it.
		</Typography>
	);

	return (
		<AlertDialog
			open={open}
			title="Remove Employee?"
			handleClose={handleClose}
			dialogActions={actions}
			dialogText={dialogText}
		/>
	);
}