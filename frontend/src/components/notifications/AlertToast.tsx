import { Snackbar, Alert, AlertProps, SnackbarOrigin } from "@mui/material";

/*
+ Simple alert snackbar: A reusable alert snackbar.
- note: 'Severity' affects the icon shown and color. However you
  can make this more customizable if we want to pass in background color
  and text color.
*/

interface AlertToastProps {
	open: boolean;
	handleClose: () => void;
	autoHideDuration?: number;
	message: string;
	anchorOrigin?: SnackbarOrigin;
	severity: AlertProps["severity"];
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
