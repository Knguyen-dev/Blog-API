import { Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import BlogPostCard from "./components/BlogPostCard";
import BlogPostCardSkeleton from "./components/BlgoPostCardSkeleton";

import DeletePostDialog from "./components/DeletePostDialog";
import EditPostStatusDialog from "./components/EditPostStatusDialog";
import usePostNavigation from "../../Browse/hooks/usePostNavigation";
import usePrivateFetchData from "../../../hooks/usePrivateFetchData";
import useAuthContext from "../../../hooks/useAuthContext";
import { verifyAdmin } from "../../../../../client/src/utils/roleUtils";
import { IPost } from "../../../types/Post";

// Prepare the array of skeletons to be rendered
const numSkeletons = 8;
const cardSkeletons = Array.from({ length: numSkeletons }, (_, index) => (
  <BlogPostCardSkeleton key={index} />
));

export default function ManagePostsPage() {
  const { auth } = useAuthContext();
  const { goToPostPage, goToEditPostPage, goToCreatePostPage } =
    usePostNavigation();

  /*
  - ManagePostPage is behind a protected route component, guaranteeing that 
    auth.user is defined. So we'll do non-null assertion here
  */

  // Check if the user is an admin; if not they're an editor
  const isAdmin = verifyAdmin(auth.user!.role);

  let endPoint = "";
  if (isAdmin) {
    endPoint = "/posts";
  } else {
    endPoint = `/users/${auth.user!._id}/posts`;
  }

  const {
    data: posts,
    setData: setPosts,
    error,
  } = usePrivateFetchData<IPost[]>(endPoint);

  // Open state for the delete post dialog
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  /*
  - handleCloseDialog: Closes the delete post dialog
  
  - handleOpenDialog: Opens the 'delete post' dialog and sets the 
    'activePostIndex' to set the index of the post being deleted.
  */
  const handleCloseDialog = () => setActiveDialog(null);
  const handleOpenDialog = (index: number, dialogName: string) => {
    setActiveDialog(dialogName);
    setActivePostIndex(index);
  };

  let activePost = undefined;
  if (posts && activePostIndex !== null) {
    activePost = posts[activePostIndex];
  }

  return (
    <Box className="tw-flex tw-flex-col">
      <Box component="header" className="tw-mb-4">
        <Typography variant="h5" className="tw-mb-2">
          Manage Posts
        </Typography>
        <Button
          variant="outlined"
          aria-label="Go to create post page"
          onClick={goToCreatePostPage}>
          Create Post
        </Button>
      </Box>

      {/* Dialog for deleting a post */}
      {activeDialog === "deletePost" && activePost && (
        <DeletePostDialog
          open={true}
          post={activePost}
          handleClose={handleCloseDialog}
          setPosts={setPosts}
        />
      )}

      {activeDialog === "editPostStatus" && activePost && (
        <EditPostStatusDialog
          open={true}
          selectedPost={activePost}
          handleClose={handleCloseDialog}
          setPosts={setPosts}
        />
      )}

      {/* Grid: Renders loading skeletons, error messages, and Blog Post cards*/}
      <Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
        {posts ? (
          posts.length > 0 ? (
            posts.map((post, index) => {
              // Default card actions
              const cardActions = [
                {
                  label: "Edit",
                  onClick: () => goToEditPostPage(post._id),
                  ariaLabel: "Go to edit post page",
                },

                {
                  label: "Delete",
                  onClick: () => handleOpenDialog(index, "deletePost"),
                  ariaLabel: "Delete post",
                },
              ];

              /*
            - If an admin, but isn't author of the post, the edit button will open
              the a dialog to edit the post's status, rather than redirecting the user 
              to the editor suite.
            */
              if (isAdmin && auth.user!._id != post.user._id) {
                cardActions[0] = {
                  label: "Edit Status",
                  onClick: () => handleOpenDialog(index, "editPostStatus"),
                  ariaLabel: "Edit the status of this post",
                };
              }

              return (
                <BlogPostCard
                  key={index}
                  post={post}
                  onCardClick={() => {
                    // If post is published, then allow us to be redirected to the post page
                    if (post.isPublished) {
                      goToPostPage(post.slug);
                    }
                  }}
                  // Change the label depending on if the post is published
                  ariaLabel={
                    post.isPublished
                      ? `View post titled ${post.title}`
                      : "Post is unpublished and cannot be viewed"
                  }
                  cardActions={cardActions}
                />
              );
            })
          ) : (
            <Typography>
              No posts have been created. Please make a post!
            </Typography>
          )
        ) : error ? (
          <Typography>{error}</Typography>
        ) : (
          <Typography variant="h4">{cardSkeletons}</Typography>
        )}
      </Box>
    </Box>
  );
}
