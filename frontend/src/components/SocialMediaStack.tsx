import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Stack, Link, StackProps } from "@mui/material";
// Fake social links for the site; facebook, instagram, twitter, youtube
const socialLinks = [
	{
		icon: <FacebookIcon />,
		href: "https://www.facebook.com",
		ariaLabel: "Open Facebook in a new tab",
	},
	{
		icon: <InstagramIcon />,
		href: "https://www.instagram.com",
		ariaLabel: "Open Instagram in a new tab",
	},
	{
		icon: <XIcon />,
		href: "https://www.twitter.com",
		ariaLabel: "Open Twitter or X in a new tab",
	},
	{
		icon: <YouTubeIcon />,
		href: "https://www.youtube.com",
		ariaLabel: "Open YouTube in a new tab",
	},
];

export default function SocialMediaStack(props: StackProps) {
	return (
		<Stack {...props}>
			{socialLinks.map((link, index) => (
				<Link
					key={index}
					target="_blank"
					rel="noreferrer"
					aria-label={link.ariaLabel}
					href={link.href}>
					{link.icon}
				</Link>
			))}
		</Stack>
	);
}
