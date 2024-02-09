import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<div className="not-found-page">
			<div>
				<Typography variant="h1" className="tw-mb-6">
					Sorry we couldn&apos;t find that page!
				</Typography>
				<Typography variant="h4">
					Return to the <NavLink to="/">home page</NavLink>!
				</Typography>
			</div>
		</div>
	);
}
