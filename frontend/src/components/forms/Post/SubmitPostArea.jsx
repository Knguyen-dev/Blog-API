/*
+ SubmitPostArea: Area where the user can submit their post, and also set the 
  status of their post (draft, published, private).
*/

import { Box, Button } from "@mui/material";
import BasicSelect from "../../Input/BasicSelect";
import submissionTypes from "../../../constants/posts/submissionOptions";
import PropTypes from "prop-types";
import postActions from "../../../constants/posts/postActions";

SubmitPostArea.propTypes = {
	status: PropTypes.string,
	dispatch: PropTypes.func,
};

export default function SubmitPostArea({ status, dispatch }) {
	const setStatus = (status) =>
		dispatch({ type: postActions.SET_STATUS, payload: status });

	return (
		<Box>
			<Box>
				<BasicSelect
					label="Status"
					placeholder="Enter the submission type"
					options={submissionTypes}
					value={status || ""}
					setValue={setStatus}
				/>
			</Box>

			{/* Action Buttons for hte form */}
			<Box className="tw-flex tw-justify-end tw-gap-x-4 tw-mt-4">
				<Button variant="outlined" color="secondary">
					Cancel
				</Button>
				<Button variant="contained" color="primary">
					Submit
				</Button>
			</Box>
		</Box>
	);
}
