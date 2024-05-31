import {
	Snackbar,
	Alert,
	AlertColor,
	SnackbarOrigin,
	SnackbarCloseReason,
} from "@mui/material";

/*
+ Simple alert snackbar: A reusable alert snackbar.
*/

interface AlertToastProps {
	open: boolean;
	handleClose: (
		event?: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason
	) => void;
	autoHideDuration?: number;
	message: string;
	anchorOrigin?: SnackbarOrigin;
	severity?: AlertColor;
	handleExited?: () => void;
}

export default function AlertToast({
	open,
	handleClose,
	autoHideDuration,
	message,
	anchorOrigin,
	severity,
	handleExited,
}: AlertToastProps) {
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
