import { Button, Box, Typography } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import DeleteAccountForm from "./DeleteAccountForm";
import { useState } from "react";

interface IDeleteAccountDialogProps {
  disabled: boolean;
}

export default function DeleteAccountDialog({
  disabled,
}: IDeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dialogText = (
    <Typography component="span">
      Deleting your account is permanent and cannot be undone.
    </Typography>
  );

  return (
    <Box>
      <Button
        variant="outlined"
        color="warning"
        onClick={handleOpen}
        disabled={disabled}>
        Delete Account
      </Button>
      <CustomDialog
        modalTitle="Delete Your Account"
        CustomForm={<DeleteAccountForm />}
        open={open}
        dialogText={dialogText}
        handleClose={handleClose}
      />
    </Box>
  );
}
