import {
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import { ReactNode } from "react";

interface AlertDialogProps {
	open: boolean;
	title: string;
	handleClose: () => void;
	dialogText: ReactNode;
	dialogActions: ReactNode;
}

export default function AlertDialog({
	open,
	title,
	handleClose,
	dialogText,
	dialogActions,
}: AlertDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{dialogText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>{dialogActions}</DialogActions>
		</Dialog>
	);
}
