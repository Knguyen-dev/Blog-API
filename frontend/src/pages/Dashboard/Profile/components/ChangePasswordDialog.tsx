import { Button, Box, Typography } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import ChangePasswordForm from "./ChangePasswordForm";
import { useState } from "react";

interface IChangePasswordDialogProps {
  disabled: boolean;
}

export default function ChangePasswordDialog({
  disabled,
}: IChangePasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dialogText = (
    <Typography component="span">
      Changing your password will log you out of your account.
    </Typography>
  );

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpen} disabled={disabled}>
        Change Password
      </Button>
      <CustomDialog
        modalTitle="Change Your Password"
        CustomForm={<ChangePasswordForm />}
        open={open}
        dialogText={dialogText}
        handleClose={handleClose}
      />
    </Box>
  );
}
