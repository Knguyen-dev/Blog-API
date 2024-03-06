import useDialog from "../../hooks/useDialog";
import CustomDialog from "./common/CustomDialog";
import { Box, Button, Typography } from "@mui/material";
import AddEmployeeForm from "../forms/AddEmployeeForm";
export default function AddEmployeeDialog() {
	const { open, handleOpen, handleClose } = useDialog();

	const dialogText = (
		<Typography variant="span">
			Enter the username of the account you are adding as an employee. Then
			enter the role that you them to have.
		</Typography>
	);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Add Employee
			</Button>
			<CustomDialog
				modalTitle="Sign up an Employee"
				dialogText={dialogText}
				open={open}
				CustomForm={<AddEmployeeForm />}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
