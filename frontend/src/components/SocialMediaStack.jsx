import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Stack, Link } from "@mui/material";
// Fake social links for the site; facebook, instagram, twitter, youtube
const socialLinks = [
	{
		icon: <FacebookIcon />,
		href: "https://www.facebook.com/BlogSphere",
		ariaLabel: "Facebook Profile of BlogSphere",
	},
	{
		icon: <InstagramIcon />,
		href: "https://www.instagram.com/BlogSphere",
		ariaLabel: "Instagram Profile of BlogSphere",
	},
	{
		icon: <XIcon />,
		href: "https://www.twitter.com/BlogSphere",
		ariaLabel: "Twitter or X Profile of BlogSphere",
	},
	{
		icon: <YouTubeIcon />,
		href: "https://www.youtube.com/BlogSphere",
		ariaLabel: "YouTube Channel of BlogSphere",
	},
];

export default function SocialMediaStack(props) {
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
