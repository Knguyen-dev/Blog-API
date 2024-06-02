import { Button, Box } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import EditEmailForm from "./EditEmailForm";
import { useState } from "react";

interface IEditEmailDialogProps {
	email: string;
}

export default function EditEmailDialog({ email } : IEditEmailDialogProps) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Email
			</Button>
			<CustomDialog
				modalTitle="Edit Your Email"
				CustomForm={<EditEmailForm email={email} onSuccess={handleClose} />}
				open={open}
				handleClose={handleClose}
			/>
		</Box>
	);
}
