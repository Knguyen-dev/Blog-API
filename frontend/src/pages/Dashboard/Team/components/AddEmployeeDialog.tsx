import AddEmployeeForm from "./AddEmployeeForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";

interface IAddEmployeeDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddEmployeeDialog({
  open,
  handleClose,
}: IAddEmployeeDialogProps) {
  const dialogText = (
    // Component 'span' to avoid 'p' tag being a descendant of another p tag
    <Typography component="span">
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
