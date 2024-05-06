import AlertDialog from "../../../../components/dialog/AlertDialog";
import { Typography, Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import useDeletePost from "../hooks/useDeletePost";

DeletePostDialog.propTypes = {
	post: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	}),
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	setPosts: PropTypes.func,
};

export default function DeletePostDialog({
	post,
	open,
	handleClose,
	setPosts,
}) {
	const { isLoading, error, deletePost } = useDeletePost();

	const onDeletePost = async () => {
		// Do the delete request
		const success = await deletePost(post._id);

		// On success, close the dialog and update the state of the posts array
		if (success) {
			handleClose();
			setPosts((posts) => {
				const newPosts = posts.filter((p) => p._id !== post._id);
				return newPosts;
			});
		}
	};

	const dialogActions = (
		<Box>
			<Button onClick={handleClose} color="primary">
				Cancel
			</Button>
			<Button color="warning" disabled={isLoading} onClick={onDeletePost}>
				Delete
			</Button>
		</Box>
	);

	const dialogText = (
		// Use react fragment, since div's can't appear as descendent of p tags
		<>
			<Typography component="span">
				Are you sure you want to delete the post titled &apos;{post?.title}
				&apos;?
			</Typography>
			{error && (
				<Typography
					component="span"
					sx={{ fontWeight: "700", display: "block", color: "red" }}>
					Error: {error.message}
				</Typography>
			)}
		</>
	);

	return (
		<AlertDialog
			open={open}
			title="Delete Post"
			handleClose={handleClose}
			dialogText={dialogText}
			dialogActions={dialogActions}
		/>
	);
}
