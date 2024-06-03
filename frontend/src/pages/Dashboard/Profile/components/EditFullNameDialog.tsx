import { Button, Box } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import EditFullNameForm from "./EditFullNameForm";
import { useState } from "react";

interface IEditFullNameDialogProps {
  fullName: string;
}

export default function EditFullNameDialog({
  fullName,
}: IEditFullNameDialogProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpen}>
        Edit Name
      </Button>
      <CustomDialog
        modalTitle="Edit Your Name"
        CustomForm={
          <EditFullNameForm fullName={fullName} onSuccess={handleClose} />
        }
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
