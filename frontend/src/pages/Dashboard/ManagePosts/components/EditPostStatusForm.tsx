import { Button, Box, SelectChangeEvent } from "@mui/material";
import { useState, FormEvent } from "react";

import useSavePostStatus from "../hooks/useSavePostStatus";
import { postStatuses } from "../../../EditorSuite/data/postConstants";
import NewBasicSelect from "../../../../components/select/NewBasicSelect";
import { IPost, PostStatusType } from "../../../../types/Post";

interface IEditPostStatusFormProps {
  post: IPost;
  onSuccess: (newPost: IPost) => void;
}

export default function EditPostStatusForm({
  post,
  onSuccess,
}: IEditPostStatusFormProps) {
  const [status, setStatus] = useState<PostStatusType>(post.status);
  const { isLoading, error, savePostStatus } = useSavePostStatus();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      status,
    };

    const newPost = await savePostStatus(post._id, formData);

    // If !newPost (request failed), stop function execution early
    if (!newPost) {
      return;
    }

    // At this point successful, so close dialog and update the state of the posts
    if (newPost && onSuccess) {
      onSuccess(newPost);
    }
  };

  const onStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as PostStatusType);
  };

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        <NewBasicSelect
          value={status}
          onChange={onStatusChange}
          label="Status"
          placeholder="Select the post's status"
          options={postStatuses}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          required
        />

        {error && <div className="error">{error}</div>}

        <Button
          type="submit"
          disabled={isLoading}
          sx={{ alignSelf: "end" }}
          variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  );
}
