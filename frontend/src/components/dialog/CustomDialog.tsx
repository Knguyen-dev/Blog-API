/**
 * A boostrap styled dialog that we use specifically for displaying forms.
 *
 * NOTE: While it does have prop 'CustomForm', realistically you can put anything
 * in this dialog.
 */

import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },

  "& .MuiPaper-root": {
    width: 400, // set our width for our form container
  },
}));

interface CustomDialogProps {
  openBtn?: ReactNode;
  modalTitle: string;
  dialogText?: ReactNode;
  CustomForm: ReactNode;
  open: boolean;
  handleClose: () => void;
}

export default function CustomDialog({
  modalTitle,
  dialogText,
  CustomForm,
  open,
  handleClose,
}: CustomDialogProps) {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}>
      <DialogTitle id="customized-dialog-title">{modalTitle}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 12,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {/* If there's extra dialog text, then render a component for it */}
        {dialogText && (
          <DialogContentText color="text.primary" sx={{ marginBottom: 2 }}>
            {dialogText}
          </DialogContentText>
        )}

        {CustomForm}
      </DialogContent>
    </BootstrapDialog>
  );
}
