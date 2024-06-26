// Wait this needs to be validated by react-hook-form as well
import { Button, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../../../components/Input/FormInputField";
import { useForm } from "react-hook-form";
import tagSchema from "../data/tagSchema";
import useSaveTag from "../hooks/useSaveTag";
import { ITag, ITagFormData } from "../../../../types/Post";
import { Dispatch, SetStateAction } from "react";
import FormError from "../../../../components/Input/FormError";

interface ITagFormProps {
  selectedTag?: ITag;
  setTags: Dispatch<SetStateAction<ITag[] | undefined>>;
  onSuccess: () => void;
}

export default function TagForm({
  selectedTag,
  setTags,
  onSuccess,
}: ITagFormProps) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(tagSchema),
    defaultValues: {
      title: selectedTag?.title || "",
    },
  });

  const { error, setError, isLoading, saveExistingTag, createNewTag } =
    useSaveTag();

  const onSubmit = async (formData: ITagFormData) => {
    /*
    - If tag was passed in, then we're editing an existing tag
    so include the id of that tag in formData so our saveTag hooks knows 
    what tag we're editing
    */
    let newTag = null;
    if (selectedTag) {
      if (formData.title === selectedTag.title) {
        setError("New title must be different from old title");
        return;
      }

      formData._id = selectedTag._id;
      newTag = await saveExistingTag(formData);
    } else {
      newTag = await createNewTag(formData);
    }

    // If request failed, stop execution early
    if (!newTag) {
      return;
    }

    /*
    - Request successful so update the state of the tags
    
    - If we were updating an existing tag, update the state array
      to replace the tag with the new updated tag.
    - Else if !tags, we were creating a new tag so the new state should be an
      array with the new tag at the end.
    */
    setTags((tags = []) => {
      if (selectedTag) {
        const newTags = tags.map((tag) =>
          tag._id === newTag._id ? newTag : tag
        );
        return newTags;
      } else {
        const newTags = [...tags, newTag];
        return newTags;
      }
    });

    // If onSuccess (optional function), we call it.
    // In this case it closes the dialog after success.
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
        label="Tag Title"
        variant="outlined"
        control={control}
        name="title"
        required
      />

      {error && <FormError message={error} />}

      <Button type="submit" variant="contained" disabled={isLoading}>
        Submit
      </Button>
    </Box>
  );
}
