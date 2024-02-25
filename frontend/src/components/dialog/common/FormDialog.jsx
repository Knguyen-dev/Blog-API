/*
- FormDialog: A dialog styled and made to hold our forms.


*/

import PropTypes from "prop-types";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogContentText,
} from "@mui/material";
export default function FormDialog({
	open,
	handleClose,
	dialogTitle,
	dialogText,
	children,
}) {
	return (
		<Dialog
			onClose={handleClose} // Pass in onClose so that it closes the form on backdrop click
			open={open}
			sx={{
				".MuiPaper-root": {
					width: 500, // decent size for showing most of our forms
				},
			}}>
			{/* Title of the dialog, here we'll put the title of the form */}
			<DialogTitle sx={{ paddingBottom: 0.75 }}>{dialogTitle}</DialogTitle>
			<DialogContent>
				{/* If there's extra dialog text, then render a component for it */}
				{dialogText && (
					<DialogContentText sx={{ marginBottom: 2 }}>
						{dialogText}
					</DialogContentText>
				)}

				{/* We will pass the form mark up as child component */}
				{children}
			</DialogContent>
		</Dialog>
	);
}

FormDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	dialogTitle: PropTypes.string,
	dialogText: PropTypes.element,
	children: PropTypes.element,
};
