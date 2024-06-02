import { Button, Box } from "@mui/material";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import AvatarForm from "./AvatarForm";
import { useState } from "react";
import { IUser } from "../../../../types/Post";

/*
+ NOTE: You could definitely go up another level of reusability by probably passing in the 
  button's text, custom form, etc. But after trying this, while it does save some files, it 
  doesn't really look clear or clean. As well as this, since on the profile page, many dialogs 
  are being used at the same time, you could defintely reduce the amount of states you're 
  using from 7 to one, but it doesn't look as clean or organized.
*/
interface IEditAvatarDialogProps {
	user: IUser;
}

export default function EditAvatarDialog({ user } : IEditAvatarDialogProps) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Avatar
			</Button>
			<CustomDialog
				modalTitle="Edit Your Avatar"
				CustomForm={<AvatarForm user={user} />}
				open={open}
				handleClose={handleClose}
			/>
		</Box>
	);
}
