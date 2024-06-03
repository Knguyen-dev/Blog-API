import CustomDialog from "../../../../components/dialog/CustomDialog";
import { Typography } from "@mui/material";
import EditPostStatusForm from "./EditPostStatusForm";
import { IPost } from "../../../../types/Post";
import { Dispatch, SetStateAction } from "react";

interface IEditPostStatusDialog {
  selectedPost: IPost;
  open: boolean;
  handleClose: () => void;
  setPosts: Dispatch<SetStateAction<IPost[] | undefined>>;
}

export default function EditPostStatusDialog({
  selectedPost,
  open,
  handleClose,
  setPosts,
}: IEditPostStatusDialog) {
  /*
  - Handles clean up operations for UI once the request for updating the post's status
    has finished successfully.

  1. Closes the dialog after a success
  2. Updates the state of the posts array by replacing the old version of the post
     we edited, with the updated version.
  */
  const onSuccess = (newPost: IPost) => {
    handleClose();
    setPosts((posts = []) => {
      const newPosts = posts.map((post) =>
        newPost._id === post._id ? newPost : post
      );
      return newPosts;
    });
  };

  const dialogText = (
    <Typography>
      {`You sure you want update the status of '${selectedPost.title}'?`}
    </Typography>
  );

  return (
    <CustomDialog
      modalTitle="Update the status of a post"
      dialogText={dialogText}
      CustomForm={
        <EditPostStatusForm postID={selectedPost._id} onSuccess={onSuccess} />
      }
      open={open}
      handleClose={handleClose}
    />
  );
}
