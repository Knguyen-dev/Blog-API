/*
+ ManagePostsPage: Will be a page where users can see hte posts that they've published, 
  or if they're admins, see all posts in the database. Still working on the kinks though
  since maybe we also want to include a place to manage tags. As well as this we still
  need to figure out, if we're going to limit post deletion privileges to just admins, but 
  editors as well. And how we need to modify the data-grid for that, how to create endpoints 
  with authorization rules for that, etc.

+ Rules:
- Admin:
1. Should see all posts.
2. Should be able to edit (in entirety) only their own posts. However 
  they should be able to edit the status of another user's posts.
3. Should be able to delete any post, either their own or someone else's 

- Editor:
1. Should see only the posts that they've created.
2. Should only be able to edit their own posts.
3. Should only be able to delete their own posts.

+ Explanation and plan:
Since editors can only see their and manage (edit and delete) own posts, then
the edit and delete buttons are simple. Edit button should redirect them to the 
editor suite, while the delete button will delete their own post.

However admins are a little more complicated. When the user is an admin, we will
show all posts. So they see posts that they've created and others have created. 
So the delete button stays the same, it should delete a post since admins can delete their 
own or someone else's post. However, there are two modes for the edit button:
1. If it's the admin's own post, then the edit button should redirect them to the 
  editor-suite to allow them to edit their entire post.
2. If it's someone else's post, then the 'edit' button should render a dialog
  that allows the admin to edit the status of the user's post.
*/

import { Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import BlogPostCard from "./components/BlogPostCard";
import DeletePostDialog from "./components/DeletePostDialog";
import EditPostStatusDialog from "./components/EditPostStatusDialog";
import usePostRedirect from "../../Browse/hooks/usePostRedirect";
import usePrivateFetchData from "../../../hooks/usePrivateFetchData";
import useAuthContext from "../../../hooks/useAuthContext";
import { verifyAdmin } from "../../../utils/roleUtils";

// Prepare the array of skeletons to be rendered
const numSkeletons = 8;
const cardSkeletons = Array.from({ length: numSkeletons }, (_, index) => (
	<BlogPostCard key={index} isLoading={true} />
));

export default function ManagePostsPage() {
	const { auth } = useAuthContext();

	const {
		handlePostRedirect,
		handleEditPostRedirect,
		handleCreatePostRedirect,
	} = usePostRedirect();

	// Check if the user is an admin; if not they're an editor
	const isAdmin = verifyAdmin(auth.user.role);

	let endPoint = "";
	if (isAdmin) {
		endPoint = "/posts";
	} else {
		endPoint = `/users/${auth.user._id}/posts`;
	}

	const {
		isLoading,
		data: posts,
		setData: setPosts,
		error: loadError,
	} = usePrivateFetchData(endPoint);

	// Open state for the delete post dialog
	const [activeDialog, setActiveDialog] = useState(null);
	const [activePostIndex, setActivePostIndex] = useState(null);

	/*
  - handleCloseDialog: Closes the delete post dialog
  
  - handleOpenDialog: Opens the 'delete post' dialog and sets the 
    'activePostIndex' to set the index of the post being deleted.
  */
	const handleCloseDialog = () => setActiveDialog(null);
	const handleOpenDialog = (index, dialogName) => {
		setActiveDialog(dialogName);
		setActivePostIndex(index);
	};

	// Get the activePost when activePostIndex isn't null
	const activePost = activePostIndex !== null ? posts[activePostIndex] : null;

	return (
		<Box className="tw-flex tw-flex-col">
			<Box variant="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Posts
				</Typography>
				<Button variant="outlined" onClick={handleCreatePostRedirect}>
					Create Post
				</Button>
			</Box>

			{/* Dialog for deleting a post */}
			<DeletePostDialog
				open={activeDialog === "deletePost"}
				post={activePost}
				handleClose={handleCloseDialog}
				setPosts={setPosts}
			/>

			<EditPostStatusDialog
				open={activeDialog === "editPostStatus"}
				selectedPost={activePost}
				handleClose={handleCloseDialog}
				setPosts={setPosts}
			/>

			{/* Grid: Renders loading skeletons, error messages, and Blog Post cards*/}
			<Box className="tw-flex tw-w-full tw-flex-wrap tw-justify-evenly tw-gap-4 tw-p-5">
				{isLoading ? (
					cardSkeletons
				) : loadError ? (
					<Typography>Error loading in posts</Typography>
				) : posts.length === 0 ? (
					<Typography>
						No posts have been created. Please make a post!
					</Typography>
				) : (
					posts.map((post, index) => {
						// Default card actions
						let cardActions = [
							{
								label: "Edit",
								onClick: () => handleEditPostRedirect(post._id),
							},

							{
								label: "Delete",
								onClick: () => handleOpenDialog(index, "deletePost"),
							},
						];

						/*
            - If an admin, but isn't author of the post, the edit button will open
              the a dialog to edit the post's status, rather than redirecting the user 
              to the editor suite.
            */
						if (isAdmin && auth.user._id != post.user._id) {
							cardActions[0] = {
								label: "Edit Status",
								onClick: () => handleOpenDialog(index, "editPostStatus"),
							};
						}

						return (
							<BlogPostCard
								key={index}
								post={post}
								onCardClick={() => handlePostRedirect(post.slug)}
								cardActions={cardActions}
							/>
						);
					})
				)}
			</Box>
		</Box>
	);
}
