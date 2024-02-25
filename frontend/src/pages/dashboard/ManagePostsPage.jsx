import { Button } from "@mui/material";
import useSnackbar from "../../hooks/useSnackbar";
export default function ManagePostsPage() {
	const { showSnackbar } = useSnackbar();

	return (
		<div>
			<Button onClick={() => showSnackbar({ message: "Sample Message!" })}>
				Show Snackbar
			</Button>
			<Button
				onClick={() =>
					showSnackbar({
						message: "Better Message!",
						severity: "success",
						anchorOrigin: { vertical: "bottom", horizontal: "center" },
					})
				}>
				Show Snackbar
			</Button>
		</div>
	);
}
