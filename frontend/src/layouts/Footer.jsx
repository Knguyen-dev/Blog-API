import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Stack, Box, Typography, Link } from "@mui/material";
import PropTypes from "prop-types";
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
		ariaLabel: "LinkedIn Profile of Kevin Nguyen",
	},
	{
		icon: <GitHubIcon />,
		href: "https://github.com/Knguyen-dev",
		ariaLabel: "Github Profile of Kevin Nguyen",
	},
];

Footer.propTypes = {
	className: PropTypes.string,
};

export default function Footer({ className }) {
	const goToHomePage = useHomeNavigation();
	const goToAboutPage = useAboutNavigation();
	const goToBlogPage = useBlogNavigation();
	const goToContactPage = useContactNavigation();

	return (
		<Box component="footer" className={className}>
			{/* Main footer content */}
			<Box className="tw-flex tw-justify-between tw-flex-wrap tw-gap-8">
				<Box sx={{ width: "fit-content", maxWidth: 250 }}>
					<Typography variant="h6" gutterBottom>
						{companyInfo.name}
					</Typography>
					<Typography color="text.secondary" className="tw-mb-2">
						Your ultimate guide to understanding and enjoying a wide range of
						topics, from gaming to science. Brought to you by enthusiasts who
						loving sharing knowledge.
					</Typography>
					<EmailSubscriptionForm />
				</Box>
				<Box sx={{ width: "fit-content", maxWidth: 100 }}>
					<Typography variant="h6" gutterBottom>
						Help
					</Typography>
					<Stack spacing={1}>
						<Link
							color="text.secondary"
							className="tw-no-underline hover:tw-underline"
							href="#">
							Faq
						</Link>
						<Link
							color="text.secondary"
							component="button"
							className="tw-text-start tw-no-underline hover:tw-underline"
							onClick={goToContactPage}>
							Contact us
						</Link>
						<Link
							color="text.secondary"
							className="tw-no-underline hover:tw-underline"
							href="#">
							Support Center
						</Link>
						<Link
							color="text.secondary"
							className="tw-no-underline hover:tw-underline"
							href="#">
							Security
						</Link>
					</Stack>
				</Box>
				<Box sx={{ width: "fit-content", maxWidth: 100 }}>
					<Typography variant="h6" gutterBottom>
						Company
					</Typography>
					<Stack spacing={1}>
						<Link
							color="text.secondary"
							className="tw-text-start tw-no-underline hover:tw-underline"
							component="button"
							onClick={goToHomePage}>
							Home
						</Link>
						<Link
							color="text.secondary"
							className="tw-text-start tw-no-underline hover:tw-underline"
							component="button"
							onClick={goToAboutPage}>
							About Us
						</Link>
						<Link
							color="text.secondary"
							className="tw-text-start tw-no-underline hover:tw-underline"
							component="button"
							onClick={goToBlogPage}>
							Blog
						</Link>
						<Link
							color="text.secondary"
							className="tw-no-underline hover:tw-underline"
							href="#">
							Our Services
						</Link>
					</Stack>
					<SocialMediaStack className="tw-mt-2" spacing={1} direction="row" />
				</Box>
				<Box>
					<Typography variant="h6" gutterBottom>
						Contact Us
					</Typography>
					<Stack color="text.secondary" spacing={1}>
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
				<Typography className="tw-text-sm tw-text-slate-500">
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
