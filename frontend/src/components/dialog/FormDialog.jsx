import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PropTypes from "prop-types";
import { IconButton, Box } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
export default function FormDialog({ open, handleClose, children }) {
	return (
		<Dialog
			open={open}
			// onClose={handleClose}; comment this out so that
			sx={{
				".MuiPaper-root": {
					width: 500, // decent size for showing most of our forms
				},
			}}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					padding: 0.25,
				}}>
				<IconButton onClick={handleClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			<DialogContent sx={{ paddingTop: 0 }}>{children}</DialogContent>
		</Dialog>
	);
}

FormDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	children: PropTypes.element,
};
