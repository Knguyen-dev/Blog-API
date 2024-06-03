import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CategoryCard from "./components/CategoryCard";
import SaveCategoryDialog from "./components/SaveCategoryDialog";
import DeleteCategoryDialog from "./components/DeleteCategoryDialog";
import useGetCategories from "../../EditorSuite/hooks/useGetCategories";

export default function ManageCategoriesPage() {
	const { categories, setCategories, error } = useGetCategories();

	// The index of the selected category;
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	// The name of the form that's active or showing up on a dialog
	const [activeForm, setActiveForm] = useState<string | null>(null);

	// Closes all dialogs 
	const handleCloseDialog = () => setActiveForm(null);

	/*
  - Handles opening form dialog for creating a category.
  1. Setting active index to null so that we aren't selecting any category
  2. Setting active form to 'categoryForm', which is the form we'll use 
    for adding new and updating existing categories.
  */
	const handleCreateCategory = () => {
		setActiveIndex(null);
		setActiveForm("categoryForm");
	};

	/*
  - Handles opening form dialog for editing a category
  1. Sets active index to the index of a category. 
  2. Then setting activeForm to 'categoryForm' will allow us to open
    the form dialog that contains the CategoryForm. With this and 
    a valid activeIndex, we'll know that we're opening the category form 
    to edit an existing category.
  */
	const handleEditCategory = (index: number) => {
		setActiveIndex(index);
		setActiveForm("categoryForm");
	};

	/*
  - Handles opening the delete category dialog 
  1. Set the index so we know what category we're deleting 
  2. Set activeForm to 'deleteCategory', which will indicate that 
    we are deleting a category.
  */
	const handleDeleteCategory = (index: number) => {
		setActiveIndex(index);
		setActiveForm("deleteCategory");
	};

	/*
  - Represents the existing category being selected for being updated or deleted. If 
    activeIndex isn't null, then we can index it from our list of categories.
  */

	let selectedCategory = undefined;
	if (categories && activeIndex !== null) {
		selectedCategory = categories[activeIndex];
	}

	return (
		<Box>
			<Box component="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Categories
				</Typography>
				<Button variant="contained" onClick={handleCreateCategory}>
					Create Category
				</Button>
			</Box>

			{/* Dialog and form for creating and updating existing categories */}
			<SaveCategoryDialog
				open={activeForm === "categoryForm"}
				handleClose={handleCloseDialog}
				selectedCategory={selectedCategory}
				setCategories={setCategories}
			/>

			{
				(selectedCategory && activeForm === "deleteCategory") && (
					<DeleteCategoryDialog
						category={selectedCategory}
						open={activeForm === "deleteCategory"}
						handleClose={handleCloseDialog}
						setCategories={setCategories}
					/>
				)
			}
			

			<Box>
				{categories ? (
					categories.length > 0 ? (
						categories.map((category, index) => 
							(<CategoryCard
								key={category._id}
								category={category}
								handleDelete={() => handleDeleteCategory(index)}
								handleEdit={() => handleEditCategory(index)}
								className="tw-mb-2"
							/>))
					) : (
						<Typography>No categories found! Create some new categories soon!</Typography>
					)
				) : error ? (
					<Typography>{error}</Typography>
				) : (
					<Typography variant="h4">Loading in categories...</Typography>
				)}
			</Box>
		</Box>
	);
}
