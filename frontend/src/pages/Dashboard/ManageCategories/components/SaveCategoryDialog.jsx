import CategoryForm from "./CategoryForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

SaveCategoryDialog.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	selectedCategory: PropTypes.object,
	setCategories: PropTypes.func,
};

export default function SaveCategoryDialog({
	open,
	handleClose,
	selectedCategory,
	setCategories,
}) {
	const dialogText = (
		<Typography variant="span">
			{selectedCategory
				? `Edit the existing category named '${selectedCategory.title}'!`
				: "Create a new category!"}
		</Typography>
	);

	return (
		<CustomDialog
			modalTitle={
				selectedCategory ? "Edit existing category" : "Create new category"
			}
			CustomForm={
				<CategoryForm
					selectedCategory={selectedCategory}
					onSuccess={handleClose}
					setCategories={setCategories}
				/>
			}
			open={open}
			handleClose={handleClose}
			dialogText={dialogText}
		/>
	);
}
