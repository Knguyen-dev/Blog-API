import AlertDialog from "./common/AlertDialog";
import { DialogActions, Button, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import useDialog from "../../hooks/useDialog";
import useRemoveEmployee from "../../hooks/employee/useRemoveEmployee";
import useToast from "../../hooks/useToast";
import useEmployeeContext from "../../hooks/employee/useEmployeeContext";
/*
- RemoveEmployeeDialog: Dialog that asks for confirmation before you remove
  a user as an employee.
*/
export default function RemoveEmployeeDialog({ targetUserID, disabled }) {
	const { open, handleOpen, handleClose } = useDialog();
	const { showToast } = useToast();
	const { state } = useEmployeeContext();

	const targetUser = state.employees.find((e) => e._id === targetUserID);

	console.log("Target User: ", targetUser);

	const { isLoading, submitDisabled, removeEmployee } = useRemoveEmployee();

	const onConfirm = async () => {
		const { success, error } = await removeEmployee(targetUserID);

		// If successful
		if (success) {
			showToast({
				message: `User successfully removed as an employee!`,
				severity: "success",
			});
			handleClose();
		} else {
			// Else if request failed
			showToast({
				message: error,
				severity: "error",
			});
		}

		// Regardless close the dialog
		handleClose();
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
					variant="outlined"
					disabled={isLoading || submitDisabled}
					onClick={onConfirm}>
					Confirm
				</Button>
			</Box>
		</DialogActions>
	);

	const dialogText = (
		<Typography variant="span">
			Do you want to confirm removing &apos;{targetUser?.username}&apos; as an
			employee?
		</Typography>
	);

	return (
		<>
			<Button
				variant="outlined"
				color="warning"
				// Disable our button to open dialog when any of these are true.
				// We can do this because we close the dialog after submission regardless.
				disabled={disabled || isLoading || submitDisabled}
				onClick={handleOpen}>
				Remove Employee
			</Button>
			<AlertDialog
				open={open}
				title="Remove Employee?"
				handleClose={handleClose}
				dialogActions={actions}
				dialogText={dialogText}
			/>
		</>
	);
}
RemoveEmployeeDialog.propTypes = {
	isLoading: PropTypes.bool,
	changeAvatar: PropTypes.func,
	disabled: PropTypes.bool,
	targetUserID: PropTypes.string,
};
