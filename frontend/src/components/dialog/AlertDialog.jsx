import {
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	DialogActions,
} from "@mui/material";

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
			<DialogActions>{dialogActions}</DialogActions>
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
