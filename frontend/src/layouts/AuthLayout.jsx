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


- NOTE: Notice about snackbar. If you
  want the snackbar to be more reusable, you can
  also have the message and severity of the snackbar 
  in different states. Then you'd pass down the state
  setting functions through Outlet context. 
*/

import SimpleSnackbar from "../components/notifications/SimpleSnackbar";
import { useState } from "react";

export default function AuthLayout() {
	const [open, setOpen] = useState(false);

	// Opens snackbar
	const handleOpen = () => {
		setOpen(true);
	};

	// Closes snackbar
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		// For smaller sizes flex col, but above mobile it's flex row
		<div className="tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-cente">
			<Grid container className="tw-justify-center tw-items-center" spacing={2}>
				<Grid item xs={8} md={4} className="tw-text-center">
					<div>
						<Typography variant="h2">Blog Sphere</Typography>
						<Typography variant="h5">It&apos;s quick and easy</Typography>
					</div>
				</Grid>
				<Grid item xs={8} md={4}>
					<Outlet context={{ handleOpen }} />
				</Grid>
			</Grid>

			{/* Snackbar for the auth layout. Currently just shows when user registration is successful */}
			<SimpleSnackbar
				open={open}
				handleClose={handleClose}
				autoHideDuration={5000}
				message="User registration successful!"
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				severity="success"
			/>
		</div>
	);
}
