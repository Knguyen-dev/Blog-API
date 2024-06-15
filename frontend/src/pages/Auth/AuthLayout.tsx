import { Typography, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
/**
 * AuthLayout: Layout that renders auth related forms. Such as login or sign up fomr.
 */
export default function AuthLayout() {
  return (
    // For smaller sizes flex col, but above mobile it's flex row
    <div className="tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center">
      <Grid container className="tw-justify-center tw-items-center" spacing={2}>
        <Grid
          item
          xs={8}
          md={4}
          className="tw-text-center tw-hidden sm:tw-inline">
          <div>
            <Typography variant="h2">Blog Sphere</Typography>
            <Typography variant="h5" component="h3">
              It&apos;s quick and easy
            </Typography>
          </div>
        </Grid>

        {/* This is where a given form is rendered. */}
        <Grid item xs={8} md={4}>
          <Outlet />
        </Grid>
      </Grid>
    </div>
  );
}
