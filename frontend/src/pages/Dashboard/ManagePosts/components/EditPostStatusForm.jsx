import { Button, Box } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

import useSavePostStatus from "../hooks/useSavePostStatus";
import { postStatuses } from "../../../EditorSuite/data/postConstants";
import NewBasicSelect from "../../../../components/select/NewBasicSelect";

EditPostStatusForm.propTypes = {
	postID: PropTypes.string,
	onSuccess: PropTypes.func,
};

export default function EditPostStatusForm({ postID, onSuccess }) {
	const [status, setStatus] = useState("");
	const { isLoading, error, savePostStatus } = useSavePostStatus();

	const onSubmit = async (e) => {
		e.preventDefault();

		const formData = {
			status,
		};

		const newPost = await savePostStatus(postID, formData);

		// If !newPost (request failed), stop function execution early
		if (!newPost) {
			return;
		}

		// At this point successful, so close dialog and update the state of the posts
		if (newPost && onSuccess) {
			onSuccess(newPost);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
				<NewBasicSelect
					value={status}
					setValue={setStatus}
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
