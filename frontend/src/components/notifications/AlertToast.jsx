import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

/*
+ Simple alert snackbar: A reusable alert snackbar.

- note: 'Severity' affects the icon shown and color. However you
  can make this more customizable if we want to pass in background color
  and text color.
*/

export default function AlertToast({
	open,
	handleClose,
	autoHideDuration,
	message,
	anchorOrigin,
	severity,
	handleExited,
}) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			anchorOrigin={anchorOrigin}
			TransitionProps={{ onExited: handleExited }}>
			<Alert
				onClose={handleClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
}

AlertToast.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	autoHideDuration: PropTypes.number,
	message: PropTypes.string,
	anchorOrigin: PropTypes.object,
	severity: PropTypes.string,
	handleExited: PropTypes.func,
};
