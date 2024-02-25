import AvatarForm from "../forms/AvatarForm";
import { Box, Button } from "@mui/material";
import FormDialog from "./common/FormDialog";
import useDialog from "../../hooks/useDialog";
export default function EditAvatarDialog() {
	const { open, handleOpen, handleClose } = useDialog();

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Avatar
			</Button>

			<FormDialog
				open={open}
				handleClose={handleClose}
				dialogTitle="Update Your Avatar">
				<AvatarForm />
			</FormDialog>
		</Box>
	);
}
