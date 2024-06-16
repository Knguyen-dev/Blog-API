import { useParams } from "react-router-dom";
import MuiRouterLink from "../components/MuiRouterLink";
import { Box, Typography } from "@mui/material";
import useVerifyEmail from "./Dashboard/Profile/hooks/useVerifyEmail";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const { verifyEmailToken } = useParams();
  const { data: successMessage, error, verifyEmail } = useVerifyEmail();

  useEffect(() => {
    if (verifyEmailToken) {
      verifyEmail(verifyEmailToken);
    }

    // Email verification should only run once; use this to prevent it running extra times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box component="section" className="tw-text-center full-background-page">
      <Box component="header">
        <Typography variant="h2" component="h1">
          Email Verification
        </Typography>
      </Box>

      <Box>
        {successMessage ? (
          // Successful email verification
          <Typography fontSize={24} color="success.main">
            {successMessage}
          </Typography>
        ) : error ? (
          <Typography fontSize={24} color="error.main">
            {error}
          </Typography>
        ) : (
          <Typography>Verifying Email...</Typography>
        )}

        {/* Link back to the profile page of the dashboard */}

        <Typography fontSize={24}>
          <MuiRouterLink to="/dashboard" aria-label="Go to profile page">
            Go to profile page
          </MuiRouterLink>
        </Typography>
      </Box>
    </Box>
  );
}
