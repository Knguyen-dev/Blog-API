import FormDialog from "../../../../components/dialog/FormDialog";
import EditPostStatusForm from "./EditPostStatusForm";
import PropTypes from "prop-types";

EditPostStatusDialog.propTypes = {
	selectedPost: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
	}),
	open: PropTypes.bool,
	handleClose: PropTypes.func,
	setPosts: PropTypes.func,
};

export default function EditPostStatusDialog({
	selectedPost,
	open,
	handleClose,
	setPosts,
}) {
	/*
  - Handles clean up operations for UI once the request for updating the post's status
    has finished successfully.

  1. Closes the dialog after a success
  2. Updates the state of the posts array by replacing the old version of the post
     we edited, with the updated version.
  */
	const onSuccess = (newPost) => {
		handleClose();
		setPosts((posts) => {
			const newPosts = posts.map((post) =>
				newPost._id === post._id ? newPost : post
			);
			return newPosts;
		});
	};

	return (
		<FormDialog
			open={open}
			form={
				<EditPostStatusForm postID={selectedPost?._id} onSuccess={onSuccess} />
			}
			modalTitle="Update the status of a post"
			menuText={`You sure you want update the status of '${selectedPost?.title}'?`}
			handleClose={handleClose}
			hidden={true}
		/>
	);
}
