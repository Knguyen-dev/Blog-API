import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<div className="rejection-page">
			<Typography variant="h1" className="tw-mb-6">
				Sorry we couldn&apos;t find that page!
			</Typography>
			<Typography variant="h4">
				Return to the <Link to="/">home page</Link>!
			</Typography>
		</div>
	);
}
