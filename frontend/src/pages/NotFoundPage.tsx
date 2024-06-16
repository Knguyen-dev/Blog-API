import { Typography } from "@mui/material";
import MuiRouterLink from "../components/MuiRouterLink";

/**
 * Page that you'll redirect the user to when they enter a bad client route.
 */
export default function NotFoundPage() {
  return (
    <div className="full-background-page">
      <Typography variant="h1" className="tw-mb-6">
        Sorry we couldn&apos;t find that page!
      </Typography>
      <Typography variant="h4">
        Return to the{" "}
        <MuiRouterLink to="/" aria-label="Go to home page">
          home page
        </MuiRouterLink>
        !
      </Typography>
    </div>
  );
}
