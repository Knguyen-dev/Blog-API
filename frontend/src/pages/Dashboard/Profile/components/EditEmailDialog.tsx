import { Button, Box, Typography } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import EditEmailForm from "./EditEmailForm";
import { useState } from "react";
import useToast from "../../../../hooks/useToast";

interface IEditEmailDialogProps {
  email: string;
}

export default function EditEmailDialog({ email }: IEditEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { showToast } = useToast();

  const onSuccess = (successMessage: string) => {
    showToast({
      message: successMessage,
      autoHideDuration: 30000,
    });
    handleClose();
  };

  const dialogText = (
    <Typography>
      Enter the new email you want to change to. Note that you will have to
      verify the email before it gets set to your account. To resend the
      verification link, just hit update button again!
    </Typography>
  );

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpen}>
        Edit Email
      </Button>
      <CustomDialog
        modalTitle="Edit Your Email"
        dialogText={dialogText}
        CustomForm={<EditEmailForm email={email} onSuccess={onSuccess} />}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
