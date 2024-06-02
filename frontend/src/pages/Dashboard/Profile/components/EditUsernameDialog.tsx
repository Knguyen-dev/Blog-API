import { Button, Box } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import EditUsernameForm from "./EditUsernameForm";
import { useState } from "react";

interface IEditUsernameDialogProps {
	username: string;
}

export default function EditUsernameDialog({ username }: IEditUsernameDialogProps) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Username
			</Button>
			<CustomDialog
				modalTitle="Edit Your Username"
				CustomForm={<EditUsernameForm username={username} onSuccess={handleClose}/>}
				open={open}
				handleClose={handleClose}
			/>
		</Box>
	);
}
