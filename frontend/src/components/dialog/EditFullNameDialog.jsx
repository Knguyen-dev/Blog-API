import EditFullNameForm from "../forms/EditFullNameForm";

import PropTypes from "prop-types";
import useDialog from "../../hooks/useDialog";

import { Box, Button } from "@mui/material";
import CustomDialog from "./common/CustomDialog";
export default function EditFullNameDialog({ user }) {
	const { open, handleOpen, handleClose } = useDialog();

	return (
		<Box>
			<Button variant="outlined" onClick={handleOpen}>
				Edit
			</Button>
			<CustomDialog
				modalTitle="Update Your Name!"
				CustomForm={
					<EditFullNameForm
						fullName={user.fullName}
						handleCloseForm={handleClose}
					/>
				}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}

EditFullNameDialog.propTypes = {
	user: PropTypes.shape({
		username: PropTypes.string,
		email: PropTypes.string,
		fullName: PropTypes.string,
	}),
};
