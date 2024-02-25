// Simple hook that provides the state and functions for using a dialog
// so that we not have to create those every time.

import { useState } from "react";
export default function useDialog() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return { open, handleOpen, handleClose };
}
