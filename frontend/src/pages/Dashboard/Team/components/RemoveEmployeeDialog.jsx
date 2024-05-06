import AlertDialog from "../../../../components/dialog/AlertDialog";
import { DialogActions, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import useRemoveEmployee from "../hooks/useRemoveEmployee";

/*
- RemoveEmployeeDialog: Dialog that asks for confirmation before you remove
  a user as an employee.
*/
export default function RemoveEmployeeDialog({
	open,
	handleClose,
	targetUser,
}) {
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
				<Button variant="outlined" disabled={isLoading} onClick={onConfirm}>
					Confirm
				</Button>
			</Box>

			{error && (
				<Box sx={{ marginTop: 2 }} className="error">
					{error.message}
				</Box>
			)}
		</DialogActions>
	);

	const dialogText = (
		<Typography variant="span">
			Do you want to confirm removing user &apos;{targetUser.username}&apos; AKA
			&apos;{targetUser.fullName}&apos; as an employee?
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
RemoveEmployeeDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	targetUser: PropTypes.shape({
		_id: PropTypes.string,
		username: PropTypes.string,
		fullName: PropTypes.string,
	}),
};
