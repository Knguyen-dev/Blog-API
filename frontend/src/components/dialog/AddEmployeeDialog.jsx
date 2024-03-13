import CustomDialog from "./common/CustomDialog";
import { Typography } from "@mui/material";
import AddEmployeeForm from "../forms/AddEmployeeForm";
import PropTypes from "prop-types";
export default function AddEmployeeDialog({ open, handleOpen, handleClose }) {
	const dialogText = (
		<Typography variant="span">
			Enter the username of the account you are adding as an employee. Then
			enter the role that you them to have.
		</Typography>
	);

	return (
		<CustomDialog
			modalTitle="Sign up an Employee"
			dialogText={dialogText}
			open={open}
			CustomForm={<AddEmployeeForm />}
			handleOpen={handleOpen}
			handleClose={handleClose}
		/>
	);
}
AddEmployeeDialog.propTypes = {
	open: PropTypes.bool,
	handleOpen: PropTypes.func,
	handleClose: PropTypes.func,
};
