import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

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
        Return to the <Link to="/">home page</Link>!
      </Typography>
    </div>
  );
}
