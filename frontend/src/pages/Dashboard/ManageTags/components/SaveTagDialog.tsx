import TagForm from "./TagForm";
import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ITag } from "../../../../types/Post";

interface ISaveTagDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedTag?: ITag;
  setTags: Dispatch<SetStateAction<ITag[] | undefined>>;
}

export default function SaveTagDialog({
  open,
  handleClose,
  selectedTag,
  setTags,
}: ISaveTagDialogProps) {
  const dialogText = (
    <Typography component="span">
      {selectedTag
        ? `Edit the title of the existing tag named '${selectedTag.title}'. 
        Any posts that already have this tag will show the tag's new title!`
        : "Add a new tag that can be placed onto existing posts!"}
    </Typography>
  );

  return (
    <CustomDialog
      modalTitle={selectedTag ? "Edit existing tag" : "Create new tag"}
      CustomForm={
        <TagForm
          selectedTag={selectedTag}
          setTags={setTags}
          onSuccess={handleClose}
        />
      }
      open={open}
      dialogText={dialogText}
      handleClose={handleClose}
    />
  );
}
