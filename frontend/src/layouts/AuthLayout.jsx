/*
+ AuthLayout: Layout for the signup and login pages. Essentially the 
  only thing that's going to change is that we're going to switch
  out the form component that we're going to use


*/

import { Typography, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
/*
+ Styling:
- Have the layout's height 100vh. By doing this we can center 
  the content on the screen.
*/

export default function AuthLayout() {
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
					<Outlet />
				</Grid>
			</Grid>
		</div>
	);
}
