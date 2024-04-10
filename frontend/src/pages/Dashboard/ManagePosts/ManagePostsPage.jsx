/*
+ ManagePostsPage: Will be a page where users can see hte posts that they've published, 
  or if they're admins, see all posts in the database. Still working on the kinks though
  since maybe we also want to include a place to manage tags. As well as this we still
  need to figure out, if we're going to limit post deletion privileges to just admins, but 
  editors as well. And how we need to modify the data-grid for that, how to create endpoints 
  with authorization rules for that, etc.

+ BOOK MARK:
1. Complete AlertDialog, and check that the delete functionality will work
2. Probably

*/

import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlogPostCard from "../../../components/card/BlogPostCard";
import { useState } from "react";

import DeletePostDialog from "./DeletePostDialog";
import usePrivateFetchData from "../../../hooks/usePrivateFetchData";

// Prepare the array of skeletons to be rendered
const numSkeletons = 8;
const cardSkeletons = Array.from({ length: numSkeletons }, (_, index) => (
	<BlogPostCard key={index} isLoading={true} />
));

export default function ManagePostsPage() {
	const navigate = useNavigate();
	const {
		isLoading,
		data: posts,
		setData: setPosts,
		error: loadError,
	} = usePrivateFetchData("/posts");

	// Open state for the delete post dialog
	const [isOpen, setIsOpen] = useState(false);
	const [activePostIndex, setActivePostIndex] = useState(null);

	// Opens page for editing a post
	const handleEditPost = (post) => {
		navigate(`/editor-suite/${post._id}`);
	};

	const handleCreatePost = () => navigate("/editor-suite");

	/*
  - handleCloseDialog: Closes the delete post dialog
  
  - handleOpenDialog: Opens the 'delete post' dialog and sets the 
    'activePostIndex' to set the index of the post being deleted.
  */
	const handleCloseDialog = () => setIsOpen(false);
	const handleOpenDialog = (index) => {
		setIsOpen(true);
		setActivePostIndex(index);
	};

	// Get the activePost when activePostIndex isn't null
	const activePost = activePostIndex !== null ? posts[activePostIndex] : null;

	return (
		<Box className="tw-flex tw-flex-col tw-h-full">
			<Box variant="header" className="tw-mb-4 ">
				<Typography variant="h5" className="tw-mb-2">
					Manage Posts
				</Typography>
				<Button variant="outlined" onClick={handleCreatePost}>
					Create Post
				</Button>
			</Box>

			{/* Dialog for deleting a post */}
			<DeletePostDialog
				open={isOpen}
				post={activePost}
				handleClose={handleCloseDialog}
				setPosts={setPosts}
			/>

			{/* Grid: Renders loading skeletons, error messages, and Blog Post cards*/}
			<Box
				className="tw-grid tw-gap-2 tw-items-start"
				sx={{
					gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
				}}>
				{isLoading ? (
					cardSkeletons
				) : loadError ? (
					<Typography>Error loading in posts</Typography>
				) : posts.length === 0 ? (
					<Typography>
						No posts have been created. Please make a post!
					</Typography>
				) : (
					posts.map((post, index) => (
						<BlogPostCard
							key={index}
							post={post}
							cardActions={[
								{
									label: "Delete",
									onClick: () => handleOpenDialog(index),
								},
								{
									label: "Edit",
									onClick: () => handleEditPost(post),
								},
							]}
						/>
					))
				)}
			</Box>
		</Box>
	);
}
