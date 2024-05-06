import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FormDialog from "../../../components/dialog/FormDialog";
import CategoryForm from "./components/CategoryForm";
import CategoryCard from "./components/CategoryCard";
import DeleteCategoryDialog from "./components/DeleteCategoryDialog";
import useGetCategories from "../../EditorSuite/hooks/useGetCategories";

export default function ManageCategoriesPage() {
	const { categories, setCategories, isLoading, error } = useGetCategories();

	// The index of the selected category;
	const [activeIndex, setActiveIndex] = useState(null);

	// Which dialog/form is active/visible
	const [activeForm, setActiveForm] = useState(null);

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
	const handleEditCategory = (index) => {
		setActiveIndex(index);
		setActiveForm("categoryForm");
	};

	/*
  - Handles opening the delete category dialog 
  1. Set the index so we know what category we're deleting 
  2. Set activeForm to 'deleteCategory', which will indicate that 
    we are deleting a category.
  */
	const handleDeleteCategory = (index) => {
		setActiveIndex(index);
		setActiveForm("deleteCategory");
	};

	/*
  - Represents the existing category being selected for being updated or deleted. If 
    activeIndex isn't null, then we can index it from our list of categories.
  */
	const selectedCategory =
		activeIndex !== null ? categories[activeIndex] : null;

	return (
		<Box>
			<Box variant="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Categories
				</Typography>
				<Button variant="outlined" onClick={handleCreateCategory}>
					Create Category
				</Button>
			</Box>

			{/* Dialog and form for creating and updating existing categories */}
			<FormDialog
				open={activeForm === "categoryForm"}
				handleClose={handleCloseDialog}
				modalTitle={selectedCategory ? "Edit Category!" : "Create Category"}
				hidden={true}
				form={
					<CategoryForm
						selectedCategory={selectedCategory}
						onSuccess={handleCloseDialog}
						setCategories={setCategories}
					/>
				}
			/>

			<DeleteCategoryDialog
				category={selectedCategory}
				open={activeForm === "deleteCategory"}
				handleClose={handleCloseDialog}
				setCategories={setCategories}
			/>

			<Box>
				{isLoading ? (
					<Typography>Loading Categories...</Typography>
				) : error ? (
					<Typography>{error.message}</Typography>
				) : categories.length === 0 ? (
					<Typography>
						No categories have been created. Please make a category!
					</Typography>
				) : (
					categories.map((category, index) => (
						<CategoryCard
							key={index}
							category={category}
							handleDelete={() => handleDeleteCategory(index)}
							handleEdit={() => handleEditCategory(index)}
							className="tw-mb-2"
						/>
					))
				)}
			</Box>
		</Box>
	);
}
