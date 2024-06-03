import { Button, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../../../components/Input/FormInputField";
import { useForm } from "react-hook-form";
import categorySchema from "../data/categorySchema";
import useSaveCategory from "../hooks/useSaveCategory";
import { ICategory, ICategoryFormData } from "../../../../types/Post";
import { Dispatch, SetStateAction } from "react";

/* 
+ CategoryForm: Form for creating or editing an existing category. It accepts 
'category' which will be the category object. If a category object is passed that 
means we are updating/editing an existing category. Else category object is null, so 
that means we are creating a brand new category.
*/

interface ICategoryFormProps {
  selectedCategory?: ICategory;
  onSuccess: () => void;
  setCategories: Dispatch<SetStateAction<ICategory[] | undefined>>;
}

export default function CategoryForm({
  selectedCategory,
  onSuccess,
  setCategories,
}: ICategoryFormProps) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      title: selectedCategory?.title || "",
      description: selectedCategory?.description || "",
    },
  });

  const {
    error,
    setError,
    isLoading,
    saveExistingCategory,
    createNewCategory,
  } = useSaveCategory();

  const onSubmit = async (formData: ICategoryFormData) => {
    let newCategory = null;
    /*
		- Handle making the request itself:
		- If a category was passed in, that means we are editing an existing category.
		So to indicate that, we include the id of the category we are updating in the formData 
		so that our saveCategory hook knows what category we are supposed to be updating.
		*/
    if (selectedCategory) {
      if (
        formData.title == selectedCategory.title &&
        selectedCategory.description == formData.description
      ) {
        setError(
          "Title and description was unchanged! Please change them before submitting an update!"
        );
        return;
      }
      // Assign the ._id value to the formData, and do the request to save the existing category
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
		- Else, we are creating a new category, our new state would be 
		an array of categories and the new category we created at the end
		*/
    setCategories((categories = []) => {
      if (selectedCategory) {
        return categories.map((category) =>
          category._id === newCategory._id ? newCategory : category
        );
      } else {
        return [...categories, newCategory];
      }
    });

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
        required
      />

      <FormInputField
        label="Description"
        variant="outlined"
        control={control}
        name="description"
        multiline={true}
        rows={4}
        required
      />

      {error && <div className="error">{error}</div>}

      <Button type="submit" variant="outlined" disabled={isLoading}>
        Submit
      </Button>
    </Box>
  );
}
