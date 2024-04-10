import useDeleteCategory from "../hooks/useDeleteCategory";
import AlertDialog from "../../../../components/dialog/AlertDialog";
import { Button, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

DeleteCategoryDialog.propTypes = {
	category: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
	}),
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	setCategories: PropTypes.func,
};

export default function DeleteCategoryDialog({
	category,
	open,
	handleClose,
	setCategories,
}) {
	const { error, isLoading, submitDisabled, deleteCategory } =
		useDeleteCategory();

	const onSubmit = async () => {
		const success = await deleteCategory(category._id);

		// If we were successful, update the state and close the dialog
		if (success) {
			setCategories((categories) =>
				categories.filter((c) => c._id !== category._id)
			);

			handleClose();
		}
	};

	const deleteDialogActions = (
		<Box>
			<Button onClick={handleClose}>Cancel</Button>
			<Button
				onClick={onSubmit}
				color="warning"
				sx={{ marginLeft: 1 }}
				disabled={isLoading || submitDisabled}>
				Delete
			</Button>
		</Box>
	);

	const dialogText = (
		<Box>
			<Typography component="span">
				Are you sure you want to delete the &apos;{category?.title}
				&apos; category? All posts in this category will have no category after.
			</Typography>
			{error && (
				<Typography
					component="span"
					sx={{ fontWeight: "700", display: "block", color: "red" }}>
					Error: {error}
				</Typography>
			)}
		</Box>
	);

	return (
		<AlertDialog
			open={open}
			title="Delete Category!"
			handleClose={handleClose}
			dialogText={dialogText}
			dialogActions={deleteDialogActions}
		/>
	);
}
