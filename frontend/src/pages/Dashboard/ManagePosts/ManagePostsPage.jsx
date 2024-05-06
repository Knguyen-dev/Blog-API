import { Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import BlogPostCard from "./components/BlogPostCard";
import DeletePostDialog from "./components/DeletePostDialog";
import EditPostStatusDialog from "./components/EditPostStatusDialog";
import usePostNavigation from "../../Browse/hooks/usePostNavigation";
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

	const { goToPostPage, goToEditPostPage, goToCreatePostPage } =
		usePostNavigation();

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
				<Button variant="outlined" onClick={goToCreatePostPage}>
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
					<Typography>{loadError.message}</Typography>
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
								onClick: () => goToEditPostPage(post._id),
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
								onCardClick={() => goToPostPage(post.slug)}
								cardActions={cardActions}
							/>
						);
					})
				)}
			</Box>
		</Box>
	);
}
