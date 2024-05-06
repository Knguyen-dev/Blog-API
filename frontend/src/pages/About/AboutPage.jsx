import Diversity3Icon from "@mui/icons-material/Diversity3";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import {
	Button,
	Box,
	Typography,
	Stack,
	Container,
	Grid,
	useTheme,
} from "@mui/material";
import SocialMediaStack from "../../components/SocialMediaStack";

import ResponsiveImg from "../../components/img/ResponsiveImg";

import { companyInfo } from "../../constants/companyInfo";

const companyValues = [
	{
		icon: <Diversity3Icon fontSize="inherit" />,
		title: "Be Excellent to Each Other",
		description: `As humans who share common needs, we treat each other with care and respect. We value diversity of people and ideas. We have faith in 
    each other’s ability to succeed and cultivate that potential by inspiring and nurturing growth. We recognize and express sincere gratitude for each other’s contributions.`,
	},
	{
		icon: <TrendingUpIcon fontSize="inherit" />,
		title: "Always keep growing",
		description: `We leverage our strengths, and pursue growth in areas where improvement is needed. When we make mistakes or don’t know something, we 
    are not afraid to be vulnerable and admit it. We continuously pursue knowledge and are happy to share it with others.`,
	},
	{
		icon: <TipsAndUpdatesIcon fontSize="inherit" />,
		title: "Start With Why",
		description: `Curiousity is the catalyst for discovery. Our inclination to find out about 'why' launches us forward, but it also helps keep us grounded. 
    Exploring the unknown and ensuring that we are getting the full picture behind a story, is a challenge that we embrace with open arms. With this in mind, 
    we will think creativity about the future, and deliver transformative change!`,
	},
	{
		icon: <SelfImprovementIcon fontSize="inherit" />,
		title: "Fail and Advance",
		description: `When we strive, we may fail. Failure gives us unparalleled knowledge about ourselves and our subject matter. We face our failures with resilience, using what we learn from failures to advance.`,
	},
];

export default function AboutPage() {
	const theme = useTheme();
	return (
		<Box className="tw-p-8 tw-flex tw-flex-col tw-gap-y-8">
			{/* Header */}
			<Container className="tw-text-center">
				<Typography variant="h2">About {companyInfo.name}</Typography>
				<Typography variant="h5" fontWeight={300}>
					{companyInfo.slogan}
				</Typography>
			</Container>

			{/* What does the site do, what is it? */}
			<Container component="section" className="tw-text-center">
				<Typography variant="h4" className="tw-mb-8">
					What is {companyInfo.name}?
				</Typography>
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6}>
						<Typography className="tw-text-start" paragraph>
							{companyInfo.name} is a community of gamers, creators, and
							enthusiasts who share their knowledge and experiences. Our site is
							dedicated to providing a platform for gaming enthusiasts to share
							their thoughts and opinions about gaming, entertainment, and
							technology.
						</Typography>
						<Typography className="tw-text-start">
							We at {companyInfo.name} are determined to create an environment
							where entertainment and insight can collide. Through this, we work
							towards producing quality and thought provoking articles relating
							to the entertainment media that we enjoy consuming.
						</Typography>
					</Grid>

					<Grid item xs={12} sm={6}>
						<ResponsiveImg
							src="/happy-team-at-computer.jpg"
							alt="Happy team at computer"
							rounded="md"
						/>
					</Grid>
				</Grid>
			</Container>

			{/* Mission and Vision */}
			<Container component="section">
				<Typography variant="h4" className="tw-mb-8 tw-text-center">
					Mission and Vision
				</Typography>

				<Grid container spacing={4} className="tw-justify-center">
					<Grid item xs={12} sm={7}>
						<ResponsiveImg
							src="/team-reacting-to-success.jpg"
							alt="Happy team at computer"
							rounded="md"
						/>
					</Grid>
					<Grid item xs={12} sm={5}>
						<Typography className="tw-text-start" paragraph>
							Our mission at {companyInfo.name} is to foster a vibrant community
							where gamers and enthusiasts can freely exchange ideas, insights,
							and experiences. We strive to create an inclusive platform that
							celebrates diversity, encourages creativity, and promotes
							meaningful interactions. Through engaging content and interactive
							discussions, we aim to inspire, educate, and entertain our
							audience while fostering a sense of belonging and camaraderie
							within the gaming community.
						</Typography>
					</Grid>
				</Grid>
			</Container>

			{/* History and Background */}
			<Container
				component="section"
				className="tw-py-4 tw-rounded-md tw-shadow-lg"
				sx={{ background: theme.palette.sectionBg }}>
				<Typography variant="h4" className="tw-text-center" gutterBottom>
					A Brief History of {companyInfo.name}
				</Typography>
				<Box>
					<Typography paragraph>
						{companyInfo.name} was founded in 2015 by a group of passionate
						gamers and tech enthusiasts who saw the need for a platform where
						like-minded individuals could come together to share their
						experiences and insights. What started as a small community blog
						quickly grew into a thriving online hub for gaming news, reviews,
						and discussions.
					</Typography>
					<Typography paragraph>
						Over the years, {companyInfo.name} has expanded its reach and
						diversified its content, covering a wide range of topics including
						technology trends, entertainment news, and gaming culture. With a
						dedicated team of writers, editors, and contributors,{" "}
						{companyInfo.name}
						continues to evolve, staying true to its mission of providing
						valuable content and fostering meaningful connections within the
						gaming community.
					</Typography>
					<Typography>
						Today, {companyInfo.name} boasts a loyal following of gamers and
						enthusiasts from around the world, united by their shared passion
						for gaming and technology. As we look to the future, we remain
						committed to our founding principles of inclusivity, creativity, and
						community engagement, striving to make {companyInfo.name} the
						ultimate destination for gamers and tech enthusiasts alike.
					</Typography>
				</Box>
			</Container>

			{/* Company Values section */}
			<Container
				component="section"
				className="tw-py-4 tw-rounded-md tw-shadow-lg"
				sx={{ background: theme.palette.sectionBg }}>
				<Box component="header" className="tw-text-center tw-mb-4">
					<Typography variant="h4" gutterBottom>
						Our Values
					</Typography>
					<Typography className="tw-w-2/3 tw-mx-auto">
						At {companyInfo.name}, we are committed to integrity, inclusivity,
						and innovation. These values guide our interactions and drive us to
						always keep moving forward.
					</Typography>
				</Box>

				{/* List of 'values', so we're going to have icons, title, and description  */}
				<Stack direction="column" spacing={4}>
					{companyValues.map((value, index) => (
						<Box key={index} className="tw-flex tw-gap-6">
							<Box fontSize={48} color="text.secondary">
								{value.icon}
							</Box>
							<Box>
								<Typography variant="h6" fontWeight={500}>
									{value.title}
								</Typography>
								<Typography fontWeight={300}>{value.description}</Typography>
							</Box>
						</Box>
					))}
				</Stack>
			</Container>

			{/* Join Our Team */}
			<Container component="section">
				<Typography variant="h4" gutterBottom className="tw-text-center">
					Join Our Team
				</Typography>

				<Grid container spacing={4}>
					<Grid item xs={12} sm={6}>
						<Stack direction="column" className="tw-text-start">
							<Typography paragraph>
								We are always looking for talented individuals to join our team.
								If you are interested in joining the {companyInfo.name} team,
								please click the link below and we will get back to you as soon
								as possible.
							</Typography>
							<Typography>
								If you arent interested in any career options, but would still
								like to collaborate or be involved with {companyInfo.name}, then
								that&apos;s fine as well! Contact us if you want to partner or
								work with us in future projects. Whether it be you have an
								article idea, opportunity, or you want to work with us to do
								something more.
							</Typography>

							<Button variant="outlined" className="tw-mt-3 tw-self-start">
								Join Team
							</Button>
						</Stack>
					</Grid>

					<Grid item xs={12} sm={6} justifyContent="center">
						<ResponsiveImg
							src="/team-celebration.jpg"
							alt="Team of people celebrating"
							rounded="md"
						/>
					</Grid>
				</Grid>
			</Container>

			{/* Connect with Us */}
			<Container
				component="section"
				className="tw-py-4 tw-rounded-md tw-shadow-lg"
				sx={{ background: theme.palette.sectionBg }}>
				<Box component="header" className="tw-text-center">
					<Typography variant="h4" gutterBottom>
						Connect with Us
					</Typography>
					<SocialMediaStack
						className="tw-justify-center"
						spacing={1}
						direction="row"
					/>
				</Box>

				<Typography>
					Stay connected with {companyInfo.name} beyond our website. Follow us
					on social media for the latest updates, behind-the-scenes content, and
					community discussions. Engage with us on your favorite platforms to
					join the conversation and be part of our growing community!
				</Typography>
			</Container>
		</Box>
	);
}
