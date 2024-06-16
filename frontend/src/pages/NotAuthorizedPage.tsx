import { Typography } from "@mui/material";
import MuiRouterLink from "../components/MuiRouterLink";
/**
 * Page you'll send the user to when they try to access a route that they aren't authorized
 * to access.
 */
export default function NotAuthorizedPage() {
  return (
    <div className="full-background-page">
      <Typography variant="h1">Not authorized to access that!</Typography>
      <Typography variant="h4">
        Back to{" "}
        <MuiRouterLink to="/" aria-label="Go to home page">
          Home
        </MuiRouterLink>
      </Typography>
    </div>
  );
}
