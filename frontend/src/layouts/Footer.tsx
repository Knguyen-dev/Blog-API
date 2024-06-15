import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Stack, Box, Typography, Link, useTheme } from "@mui/material";
import EmailSubscriptionForm from "../pages/Home/EmailSubscriptionForm";
import useHomeNavigation from "../pages/Home/useHomeNavigation";
import useAboutNavigation from "../pages/About/useAboutNavigation";
import useBlogNavigation from "../pages/Browse/hooks/useBlogNavigation";
import useContactNavigation from "../pages/Contact/useContactNavigation";
import SocialMediaStack from "../components/SocialMediaStack";
import { companyInfo, currentYear } from "../constants/companyInfo";

// Bottom footer links; real links to project github and linkedIn
const footerLinks = [
  {
    icon: <LinkedInIcon />,
    href: "https://www.linkedin.com/in/kevin-nguyen-13313b298/",
    ariaLabel: "Open LinkedIn Profile of Kevin Nguyen in a new tab",
  },
  {
    icon: <GitHubIcon />,
    href: "https://github.com/Knguyen-dev",
    ariaLabel: "Open Github Profile of Kevin Nguyen in a new tab",
  },
];

// Uniform fontisze
const sectionTitleFontSize = 22;

interface FooterProps {
  className: string;
}

/**
 * Footer component for the app
 */
export default function Footer({ className }: FooterProps) {
  const goToHomePage = useHomeNavigation();
  const goToAboutPage = useAboutNavigation();
  const goToBlogPage = useBlogNavigation();
  const goToContactPage = useContactNavigation();

  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{ background: theme.palette.background.neutral }}
      className={className}>
      {/* Main footer content */}
      <Box className="tw-flex tw-justify-between tw-flex-wrap tw-gap-8">
        <Box sx={{ width: "fit-content", maxWidth: 250 }}>
          <Typography fontSize={sectionTitleFontSize} gutterBottom>
            {companyInfo.name}
          </Typography>
          <Typography color="text.primary" className="tw-mb-2">
            Your ultimate guide to understanding and enjoying a wide range of
            topics, from gaming to science. Brought to you by enthusiasts who
            loving sharing knowledge.
          </Typography>
          <EmailSubscriptionForm />
        </Box>
        <Box sx={{ width: "fit-content", maxWidth: 100 }}>
          <Typography fontSize={sectionTitleFontSize} gutterBottom>
            Help
          </Typography>
          <Stack spacing={1}>
            <Link
              color="text.primary"
              className="tw-no-underline hover:tw-underline"
              href="#">
              Faq
            </Link>

            <Link
              color="text.primary"
              component="button"
              className="tw-text-start tw-no-underline hover:tw-underline"
              onClick={goToContactPage}
              aria-label="Go to contact page">
              Contact us
            </Link>
            <Link
              color="text.primary"
              className="tw-no-underline hover:tw-underline"
              href="#">
              Support Center
            </Link>
            <Link
              color="text.primary"
              className="tw-no-underline hover:tw-underline"
              href="#">
              Security
            </Link>
          </Stack>
        </Box>
        <Box sx={{ width: "fit-content", maxWidth: 100 }}>
          <Typography fontSize={sectionTitleFontSize} gutterBottom>
            Company
          </Typography>
          <Stack spacing={1}>
            <Link
              color="text.primary"
              className="tw-text-start tw-no-underline hover:tw-underline"
              component="button"
              aria-label="Go to home page"
              onClick={goToHomePage}>
              Home
            </Link>
            <Link
              color="text.primary"
              className="tw-text-start tw-no-underline hover:tw-underline"
              component="button"
              aria-label="Go to about page"
              onClick={goToAboutPage}>
              About Us
            </Link>
            <Link
              color="text.primary"
              className="tw-text-start tw-no-underline hover:tw-underline"
              component="button"
              aria-label="Go to blog page"
              onClick={goToBlogPage}>
              Blog
            </Link>
            <Link
              color="text.primary"
              className="tw-no-underline hover:tw-underline"
              href="#">
              Our Services
            </Link>
          </Stack>
          <SocialMediaStack className="tw-mt-2" spacing={1} direction="row" />
        </Box>
        <Box>
          <Typography fontSize={sectionTitleFontSize} gutterBottom>
            Contact Us
          </Typography>
          <Stack color="text.primary" spacing={1}>
            <Typography>{companyInfo.address}</Typography>
            <Stack direction="row" spacing={1}>
              <EmailIcon />
              <Typography>{companyInfo.email}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <PhoneIcon />
              <Typography>{companyInfo.phoneNumber}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
      {/* Copyright and additional links*/}
      <Box className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-between tw-mt-8">
        <Typography className="tw-text-sm">
          &copy; Copyright {currentYear} {companyInfo.name} — Knguyen-Dev. All
          rights reserved.
        </Typography>

        <Box className="tw-flex tw-gap-x-2 tw-mt-1 tw-flex-wrap">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              target="_blank"
              rel="noreferrer"
              aria-label={link.ariaLabel}
              href={link.href}>
              {link.icon}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
