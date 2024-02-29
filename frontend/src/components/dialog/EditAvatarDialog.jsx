import AvatarForm from "../forms/AvatarForm";
import { Box, Button } from "@mui/material";
import CustomDialog from "./common/CustomDialog";
import useDialog from "../../hooks/useDialog";
import PropTypes from "prop-types";
export default function EditAvatarDialog({ user }) {
	const { open, handleOpen, handleClose } = useDialog();

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit Avatar
			</Button>

			<CustomDialog
				modalTitle="Edit Your Avatar!"
				CustomForm={<AvatarForm user={user} />}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}

EditAvatarDialog.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		fullName: PropTypes.string,
	}),
};
