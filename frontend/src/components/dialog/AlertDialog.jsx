import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

export default function AlertDialog({
	open,
	title,
	handleClose,
	dialogText,
	dialogActions,
}) {
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
			{dialogActions}
		</Dialog>
	);
}

AlertDialog.propTypes = {
	open: PropTypes.bool,
	title: PropTypes.string,
	handleClose: PropTypes.func,
	dialogText: PropTypes.element,
	dialogActions: PropTypes.element,
};
