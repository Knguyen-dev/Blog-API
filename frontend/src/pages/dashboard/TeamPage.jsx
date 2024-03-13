/*
+ TeamPage: A component that shows a data-grid of all users that are employees. Kind of 
  represents a page where al company users can see who's on the and 
  team/associated with the company.
*/
import { Typography } from "@mui/material";
import EmployeeGrid from "../../components/DataTable/EmployeeGrid";

export default function TeamPage() {
	return (
		<div>
			<header className="tw-mb-4 tw-flex tw-justify-between">
				<Typography variant="h5">Our Team</Typography>
			</header>
			<EmployeeGrid />
		</div>
	);
}
