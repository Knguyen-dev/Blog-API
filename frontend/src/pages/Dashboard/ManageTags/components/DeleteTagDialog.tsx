import useDeleteTag from "../hooks/useDeleteTag";
import AlertDialog from "../../../../components/dialog/AlertDialog";
import { Button, Box, Typography } from "@mui/material";
import { ITag } from "../../../../types/Post";
import { Dispatch, SetStateAction } from "react";

interface IDeleteTagDialogProps {
  selectedTag: ITag;
  setTags: Dispatch<SetStateAction<ITag[] | undefined>>;
  open: boolean;
  handleClose: () => void;
}

export default function DeleteTagDialog({
  selectedTag,
  setTags,
  open,
  handleClose,
}: IDeleteTagDialogProps) {
  const { error, isLoading, deleteTag } = useDeleteTag();

  const onSubmit = async () => {
    const success = await deleteTag(selectedTag._id);

    // If successful, update the tags array to not include the tag we deleted
    if (success) {
      setTags((tags = []) => {
        const newTags = tags.filter((tag) => tag._id !== selectedTag._id);
        return newTags;
      });
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
        disabled={isLoading}>
        Delete
      </Button>
    </Box>
  );

  const dialogText = (
    <Box>
      <Typography component="span">
        Are you sure you want to delete the &apos;{selectedTag.title}
        &apos; tag? This tag will be removed from all of the posts that have it.
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
      title="Delete Tag!"
      handleClose={handleClose}
      dialogText={dialogText}
      dialogActions={deleteDialogActions}
    />
  );
}
