import { Typography, Grid } from "@mui/material";
import SignUpForm from "../components/forms/SignUpForm";

/*
+ Vertically centering:
1. Use padding, just padding top a lot
2. Display flex
*/

export default function SignUpPage() {
	return (
		// For smaller sizes flex col, but above mobile it's flex row
		<div className="tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center  tw-bg-slate-300">
			<Grid container className="tw-justify-center tw-items-center" spacing={2}>
				<Grid item xs={8} md={4} className="tw-text-center">
					<div>
						<Typography variant="h2">Blog Sphere</Typography>
						<Typography variant="h5">It&apos;s quick and easy</Typography>
					</div>
				</Grid>
				<Grid item xs={8} md={4}>
					<SignUpForm />
				</Grid>
			</Grid>
		</div>
	);
}
