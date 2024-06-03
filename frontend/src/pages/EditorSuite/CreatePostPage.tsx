/*
+ CreatePostPage: Page for creating posts. It contains a sidebar for editing 
  and a post preview on the right side to show changes made to the post in real time.
*/
import { Grid, Typography } from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import useToast from "../../hooks/useToast";
import useAuthContext from "../../hooks/useAuthContext";
import EditPostAccordion from "./components/EditPostAccordion";
import NewPostPreview from "../Browse/NewPostPreview";
import useNewEditorContext from "./hooks/useNewEditorContext";
import { IPostState } from "../../types/Post";
import { initialPostState } from "./data/postConstants";

export default function CreatePostPage() {
  const { auth } = useAuthContext();
  const { categories, tags, submitLoading, submitError, onSubmitPost } =
    useNewEditorContext();

  // Get postData from local storage; if not found then use a default value
  const { value: postData, setValue: setPostData } =
    useLocalStorage<IPostState>(
      "postData",
      {
        ...initialPostState,
        /*
        - auth.user.fullName will be defined since CreatePostPage is a protected
          route. However we'll do this conditional for clean TypeScript
        */
        authorName: auth?.user?.fullName || "No Author Name",
      },

      // Default to true for the validation for right now;
      () => true
    );

  const { showToast } = useToast();

  // Handle submitting a post for the createPostPage
  const handleSubmitPost = async () => {
    // Call function to submit the post to backend
    const success = await onSubmitPost(postData);

    // If successful, show message and clear post
    if (success) {
      showToast({
        message: "Post successfully submitted!",
        severity: "success",
      });
      setPostData(initialPostState);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-flex-1 tw-p-5">
      <Grid
        container
        columnSpacing={4}
        className="tw-max-h-full tw-overflow-y-auto">
        <Grid item xs={12} sm={5} className="tw-h-full tw-overflow-y-auto">
          <Typography variant="h5" className="tw-text-center tw-mb-2">
            Creating New Post
          </Typography>
          <EditPostAccordion
            postData={postData}
            setPostData={setPostData}
            // Tags and categories needed for options and selections
            categories={categories}
            tags={tags}
            // Data for post submission
            onSubmitPost={handleSubmitPost}
            submitError={submitError}
            submitLoading={submitLoading}
          />
        </Grid>
        <Grid item xs={12} sm={7} className="tw-h-full tw-overflow-y-auto">
          {/* Wait to render the preview until the post is defined; this also avoids the error of passing an invalid time value 
            to our NewPostPreview, whicch in turn would cause an error. */}
          {postData && (
            <NewPostPreview
              title={postData.title}
              category={postData.category}
              body={postData.body}
              dateStr={postData.createdAt}
              authorName={postData.authorName}
              imgSrc={postData.imgSrc}
              imgCredits={postData.imgCredits}
              tags={postData.tags}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
}
