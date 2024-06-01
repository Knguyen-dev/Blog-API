import CategoryForm from "./CategoryForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import { ICategory } from "../../../../types/Post";
import { Dispatch, SetStateAction } from "react";

interface ISaveCategoryDialogProps {
	open: boolean;
	handleClose: () => void;
	selectedCategory?: ICategory;
	setCategories: Dispatch<SetStateAction<ICategory[] | undefined>>
}

export default function SaveCategoryDialog({
	open,
	handleClose,
	selectedCategory,
	setCategories,
} : ISaveCategoryDialogProps) {
	const dialogText = (
		<Typography>
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
