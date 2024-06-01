import AddEmployeeForm from "./AddEmployeeForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";

interface IAddEmployeeDialogProps {
	open: boolean;
	handleClose: () => void;
}

export default function AddEmployeeDialog({ open, handleClose }: IAddEmployeeDialogProps) {
	const dialogText = (
		<Typography>
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
