import {
	Grid,
	Typography,
	Button,
	Link,
	Container,
	Box,
	Divider,
	IconButton,
} from "@mui/material";
import TestimonyCard from "./TestimonyCard.jsx";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { companyInfo } from "../../constants/companyInfo";
import useAboutNavigation from "../About/useAboutNavigation.js";
import useBlogNavigation from "../Browse/hooks/useBlogNavigation.js";

// Fake/sample site services for example purposes
const siteServices = [
	{
		title: "Editorials",
		description: `Our editorials offer deep insights into various topics, blending
                            expert analyses with engaging storytelling to spark curiosity
                            and further exploration. From politics and science, to reviews on your favorite games and movies. Ensure that you're always in the loop and come read today!`,
		ariaLabel: "Go to Editorials page",
		href: "/editorials", // Example link to the Editorials page
	},
	{
		title: "Advertising & Marketing",
		description: `If you have something such as a game, tv show, or a something you want us to advertise, then this is the perfect place for you!`,
		ariaLabel: "Go to Advertising and Marketing page",
		href: "/advertising-marketing", // Example link to the Advertising and Marketing page
	},
	{
		title: "Article Commissions",
		description: `Need an article written on a specific topic? Our team of expert writers can create high-quality content tailored to your needs.`,
		ariaLabel: "Learn more about Article Commissions",
		href: "/article-commissions", // Example link to the Article Commissions page
	},
	{
		title: "Partnerships & Careers",
		description: `Explore opportunities for collaboration, career advancement, and partnerships with us. Whether you're looking to join our team, advertise with us, or explore potential partnerships, we're here to help you grow.`,
		ariaLabel: "Go to Partnerships and Careers page",
		href: "/partnerships-careers", // Example link to the Partnerships and Careers page
	},
];

// Fake/sample testimonies for example purposes
const sampleTestimonies = [
	{
		name: "Jane Doe",
		title: "Tech Led at 'The Wandering Mail'",
		message:
			"Amazing Stuff! BlogSphere's articles about tech and also the politicals happenings in the industry. Whether it be talking about some new gadget or software, or maybe some controversy involving a tech company, they always informative and quality articles.",
		image: "https://source.unsplash.com/100x100/?person",
	},
	{
		name: "John P. Jones",
		title: "Game Developer from 'Ice Cream Games'",
		message:
			"Really innovative stuff. BlogSphere helped us out with advertising many of our games and reach a wider audience. Their coverage has helepd us out throughout the years!",
		image:
			"https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
	{
		name: "Guermo Games",
		title: "Youtuber and Streamer",
		message:
			"The variety of topics covered by BlogSphere is astounding. I always find something new and intriguing to read. I not only like their articles on new releases of games and tv shows, but also their analysis of old classics as well.",
		image:
			"https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	},
];

export default function HomePage() {
	const goToAboutPage = useAboutNavigation();
	const goToBlogPage = useBlogNavigation();

	return (
		<div className="tw-flex tw-flex-col tw-gap-y-16">
			{/* Intro secution  */}
			<Grid id="intro" container alignItems="center" justifyContent="center">
				<Grid item xs={12} sm={6} className="xs:max-sm:tw-text-center">
					<Typography variant="h2" component="h1" gutterBottom>
						Welcome to {companyInfo.name}
					</Typography>
					<Typography color="text.secondary" className="sm:tw-w-2/3" paragraph>
						Stay updated on endless topics from gaming to science, curated for
						the curious mind. Explore a new world!
					</Typography>
					<Button
						variant="contained"
						color="primary"
						component={Link}
						aria-label="Go to blog page"
						onClick={goToBlogPage}>
						Read More
					</Button>
				</Grid>
				<Grid item xs={12} sm={4} className="xs:max-sm:tw-hidden">
					<img
						src="/people-working-graphic.png"
						alt="Landing page image/graphic for BlogSphere"
						className="tw-max-w-full tw-h-full tw-object-cover tw-rounded-md tw-overflow-hidden"
					/>
				</Grid>
			</Grid>

			{/* Services section */}
			<Container maxWidth="xl" id="services">
				{/* Header  */}
				<Box className="tw-text-center tw-mb-6" component="header">
					<Typography variant="h3" gutterBottom>
						Our Services
					</Typography>
					<Typography className="tw-w-1/2 tw-mx-auto tw-font-light">
						Our range of services caters to diverse needs, whether you&apos;re
						representing a large corporation, a prominent content creator, or
						simply an inquisitive individual. Get in touch with us to explore
						potential collaborations!
					</Typography>
				</Box>

				{/* Content */}
				<Box>
					{siteServices.map((service, index) => (
						<Box key={index} className="tw-mb-2">
							{/* Content */}
							<Box className="tw-flex tw-items-center tw-justify-between">
								<Box>
									<Typography variant="h4" component="h1" gutterBottom>
										{service.title}
									</Typography>
									<Typography variant="body1" paragraph className="tw-w-5/6">
										{service.description}
									</Typography>
								</Box>

								<Link href={service.href} aria-label={service.ariaLabel}>
									<IconButton>
										<ArrowOutwardIcon />
									</IconButton>
								</Link>
							</Box>

							<Divider />
						</Box>
					))}
				</Box>
			</Container>

			{/* About section: About the website */}
			<Container
				id="about"
				maxWidth="xl"
				className="tw-flex tw-items-center tw-flex-col md:tw-flex-row tw-gap-8">
				{/* Image */}
				<Box sx={{ flex: 1 }}>
					<img
						src="https://img.b2bpic.net/free-photo/gamer-chair-with-multicolored-neon-lights_52683-99741.jpg"
						alt=""
						style={{
							maxWidth: "100%",
							objectFit: "cover",
						}}
						className="tw-rounded-lg"
					/>
				</Box>

				{/* Content */}
				<Box style={{ flex: 1 }}>
					<Typography variant="h2" gutterBottom>
						About Us
					</Typography>
					<Typography paragraph>
						Your go-to destination for exploring a myriad of topics, from the
						depths of gaming mysteries to the latest in science and
						entertainment.
					</Typography>
					<Typography paragraph>
						We&apos;re a group of passionate writers, researchers, and
						enthusiasts who believe in the power of knowledge and the joy of
						discovery. Our mission is to deliver content that enlightens,
						entertains, and educates. Whether you&apos;re seeking deep dives
						into your favorite games, insightful analyses of the latest
						scientific discoveries, or a refreshing take on current
						entertainment trends, we&apos;ve got you covered.
					</Typography>
					<Button variant="contained" onClick={goToAboutPage}>
						Learn More
					</Button>
				</Box>
			</Container>

			{/* Testimonials: Containing testimonies from people and companies that have used the blog*/}
			<Container maxWidth="fluid" id="testimonies">
				<Box component="header" className="tw-text-center tw-mb-4">
					<Typography variant="h2" gutterBottom>
						What people are saying.
					</Typography>
					<Typography className="tw-font-light tw-w-1/2 tw-mx-auto">
						Voices from our gaming community. Our site is amazing, but
						don&apos;t take that from us, take it from these totally real
						reviews!
					</Typography>
				</Box>

				<Box className="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center">
					{sampleTestimonies.map((testimony, index) => (
						<TestimonyCard
							key={index}
							name={testimony.name}
							title={testimony.title}
							message={testimony.message}
							image={testimony.image}
						/>
					))}
				</Box>
			</Container>
		</div>
	);
}
