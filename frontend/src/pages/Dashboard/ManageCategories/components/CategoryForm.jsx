import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../../../components/Input/FormInputField";
import { useForm } from "react-hook-form";
import { titleSchema, descriptionSchema } from "../data/categorySchemas";

import useSaveCategory from "../hooks/useSaveCategory";

CategoryForm.propTypes = {
	category: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
	}),
};

/* 
+ CategoryForm: Form for creating or editing an existing category. It accepts 
'category' which will be the category object. If a category object is passed that 
means we are updating/editing an existing category. Else category object is null, so 
that means we are creating a brand new category.
*/

const validationSchema = yup.object().shape({
	title: titleSchema,
	description: descriptionSchema,
});

import propTypes from "prop-types";

CategoryForm.propTypes = {
	selectedCategory: propTypes.shape({
		_id: propTypes.string.isRequired,
		title: propTypes.string.isRequired,
		description: propTypes.string.isRequired,
	}),
	onSuccess: PropTypes.func,
	setCategories: PropTypes.func,
};

export default function CategoryForm({
	selectedCategory,
	onSuccess,
	setCategories,
}) {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			title: selectedCategory?.title,
			description: selectedCategory?.description,
		},
	});

	const {
		error,
		isLoading,
		submitDisabled,
		saveExistingCategory,
		createNewCategory,
	} = useSaveCategory();

	const onSubmit = async (formData) => {
		let newCategory = null;
		/*
    - Handle making the request itself:
    - If a category was passed in, that means we are editing an existing category.
      So to indicate that, we include the id of the category we are updating in the formData 
      so that our saveCategory hook knows what category we are supposed to be updating.
    */
		if (selectedCategory) {
			formData._id = selectedCategory._id;
			newCategory = await saveExistingCategory(formData);
		} else {
			newCategory = await createNewCategory(formData);
		}

		// If request failed stop function execution early
		if (!newCategory) {
			return;
		}

		/*
    - At this point request was successful and 'newCategory' is the newly created/updated
      category. Now update the category state:


    - If we were editing/updating an existing category, replace the category we're 
      updating with the new version
    - If !selectedCategory, we are creating a new category, our new state would be 
      an array of categories and the new category we created at the end
    */
		if (selectedCategory) {
			setCategories((categories) => {
				const newCategories = categories.map((category) =>
					category._id === newCategory._id ? newCategory : category
				);
				return newCategories;
			});
		} else {
			setCategories((categories) => {
				const newCategories = [...categories, newCategory];
				return newCategories;
			});
		}

		// If onSuccess was defined, then call onSuccess function
		if (onSuccess) {
			onSuccess();
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
			<FormInputField
				label="Category Title"
				variant="outlined"
				control={control}
				name="title"
			/>

			<FormInputField
				label="Description"
				variant="outlined"
				control={control}
				name="description"
				multiline={true}
				rows={4}
			/>

			{error && <div className="error">{error}</div>}

			<Button
				type="submit"
				variant="outlined"
				disabled={isLoading || submitDisabled}>
				Submit
			</Button>
		</Box>
	);
}
