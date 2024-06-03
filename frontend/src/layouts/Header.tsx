import {
  Typography,
  Fab,
  Grid,
  Tooltip,
  Button,
  Divider,
  Box,
  Link,
} from "@mui/material";
import ContrastIcon from "@mui/icons-material/Contrast";
import AccountMenu from "./AccountMenu";
import useAuthContext from "../hooks/useAuthContext";
import useColorContext from "../hooks/useSettingsContext";
import useHomeNavigation from "../pages/Home/useHomeNavigation";
import useAboutNavigation from "../pages/About/useAboutNavigation";
import useBlogNavigation from "../pages/Browse/hooks/useBlogNavigation";
import useContactNavigation from "../pages/Contact/useContactNavigation";
import { useNavigate } from "react-router-dom";
import { companyInfo } from "../constants/companyInfo";

export default function Header() {
  const { auth } = useAuthContext();
  const { preferences, toggleColorMode } = useColorContext();
  const navigate = useNavigate();
  const goToHomePage = useHomeNavigation();
  const goToAboutPage = useAboutNavigation();
  const goToBlogPage = useBlogNavigation();
  const goToContactPage = useContactNavigation();

  return (
    <Box
      component="header"
      className="tw-pt-2 tw-px-5 tw-sticky tw-top-0 tw-z-10"
      // style={{ background: theme.palette.headerBg }}
    >
      <Grid component="nav" container className="tw-items-center">
        <Grid item xs={12} md={3} className="xs:max-md:tw-mb-4">
          <Box className="xs:max-md:tw-text-center">
            <Typography variant="h4">
              <Link
                component="button"
                // style={{ color: theme.palette.brandColor }}
                underline="none"
                onClick={goToHomePage}>
                {companyInfo.name}
              </Link>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={10} md={5} className="tw-mx-auto xs:max-md:tw-mb-2">
          <ul className="tw-list-none tw-flex tw-flex-wrap tw-items-center tw-justify-evenly tw-gap-2 tw-p-0 tw-m-0">
            <li>
              <Link
                component="button"
                // style={{ color: theme.palette.brandColor }}
                underline="none"
                onClick={goToHomePage}>
                Home
              </Link>
            </li>
            <li>
              <Link
                component="button"
                // style={{ color: theme.palette.brandColor }}
                underline="none"
                onClick={goToAboutPage}>
                About
              </Link>
            </li>
            <li>
              <Link
                component="button"
                // style={{ color: theme.palette.brandColor }}
                underline="none"
                onClick={goToBlogPage}>
                Blog
              </Link>
            </li>
            <li>
              <Link
                component="button"
                // style={{ color: theme.palette.brandColor }}
                underline="none"
                onClick={goToContactPage}>
                Contact
              </Link>
            </li>
          </ul>
        </Grid>

        <Grid item xs={12} md={4}>
          <div className="tw-flex xs:max-md:tw-justify-center tw-justify-end tw-items-center tw-gap-x-6">
            {/* If authenticated render the menu, else redner sign in button */}
            <Tooltip
              title={`Appearance: ${preferences.darkMode ? "Dark" : "Light"}`}>
              <Fab size="small" onClick={toggleColorMode}>
                <ContrastIcon />
              </Fab>
            </Tooltip>

            {auth.user ? (
              <AccountMenu />
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/auth/login")}>
                Sign In
              </Button>
            )}
          </div>
        </Grid>
      </Grid>

      <Divider className="tw-mt-2" />
    </Box>
  );
}
