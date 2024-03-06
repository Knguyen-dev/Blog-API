import EmployeeGrid from "../../components/DataTable/EmployeeGrid";
import { Typography, Box } from "@mui/material";

export default function TeamPage() {
	// A reducer containing the employees, we use this to synchronize the data-grid and

	return (
		<div>
			<header className="tw-mb-4 tw-flex tw-justify-between">
				<Typography variant="h5">Our Team</Typography>
			</header>

			<Box>
				<EmployeeGrid />
			</Box>
		</div>
	);
}
