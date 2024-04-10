import { Typography, Box, Button } from "@mui/material";
import CustomDialog from "./CustomDialog";
import PropTypes from "prop-types";

FormDialog.propTypes = {
	open: PropTypes.bool,
	handleOpen: PropTypes.func,
	handleClose: PropTypes.func,
	menuText: PropTypes.string,
	btnText: PropTypes.string,
	btnColor: PropTypes.string,
	form: PropTypes.element,
	modalTitle: PropTypes.string,
	hidden: PropTypes.bool,
};

// Dialog with button

export default function FormDialog({
	open,
	handleOpen,
	handleClose,
	menuText,
	modalTitle,
	btnText,
	btnColor,
	form,
	hidden,
}) {
	/*
  - NOTE: Define a variant so that you don't get 'validateDOMNesting(...): <p> cannot appear as a descendant of <p>.'
    Initialize dialogText as null because, if 'menuText' is just an empty string or null
    we don't want our CustomDialog rendering a Typography component because 
    that can look bad with the spacing.
  */
	let dialogText = null;
	if (menuText) {
		dialogText = <Typography variant="span">{menuText}</Typography>;
	}

	return (
		<Box>
			{!hidden && (
				<Button variant="outlined" color={btnColor} onClick={handleOpen}>
					{btnText}
				</Button>
			)}

			<CustomDialog
				modalTitle={modalTitle}
				dialogText={dialogText}
				CustomForm={form}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</Box>
	);
}
