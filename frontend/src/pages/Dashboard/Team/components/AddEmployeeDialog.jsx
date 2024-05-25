import AddEmployeeForm from "./AddEmployeeForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

AddEmployeeDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};

export default function AddEmployeeDialog({ open, handleClose }) {
	const dialogText = (
		<Typography variant="span">
			Add an existing user account as an employee! To count as an employee, a
			user has to be an editor or admin.
		</Typography>
	);

	return (
		<CustomDialog
			modalTitle="Add Employee"
			CustomForm={<AddEmployeeForm />}
			open={open}
			dialogText={dialogText}
			handleClose={handleClose}
		/>
	);
}
