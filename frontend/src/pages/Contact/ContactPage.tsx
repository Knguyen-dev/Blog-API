import { Typography, Box, Grid, Stack, useTheme } from "@mui/material";

import { companyInfo } from "../../constants/companyInfo";
import ContactForm from "./ContactForm";

export default function ContactPage() {
	const theme = useTheme();

	return (
		<Box className="tw-p-8">
			<Box className="tw-text-center tw-mb-12" component="header">
				<Typography variant="h2" gutterBottom>
					Contact Us
				</Typography>
				<Typography>
					Got questions or need help? Feel free to reach out, our team would be
					glad to help you!
				</Typography>
			</Box>
			<Grid container className="tw-justify-evenly xs:max-sm:tw-gap-y-8">
				<Grid item sm={4}>
					<Stack
						direction="column"
						spacing={2}
						className="tw-p-4 tw-rounded-md tw-shadow-lg"

						// sx={{ background: theme.palette.sectionBg }}
					>
						<Box>
							<Typography variant="h6" component="h2" gutterBottom>
								How can we help?
							</Typography>
							<Typography>
								Whether you have questions about our services, need assistance
								with a specific issue, or simply want to provide feedback,
								we&apos;re here to assist you every step of the way. Our team is
								dedicated to providing timely and helpful support to ensure your
								experience with us is as smooth and enjoyable as possible.
							</Typography>
						</Box>
						<Box>
							<Typography variant="h6" component="h2" gutterBottom>
								Points of contact:
							</Typography>
							<Typography className="tw-break-words">
								Email: {companyInfo.email}
							</Typography>
							<Typography>Address: {companyInfo.address}</Typography>
							<Typography>Phone: {companyInfo.phoneNumber}</Typography>
						</Box>
					</Stack>
				</Grid>

				<Grid item sm={5}>
					<Typography variant="h6" component="h2" gutterBottom>
						Send Us a Message
					</Typography>
					<Typography className="tw-mb-3">
						Please fill out the information and we will get back to you within
						1-2 business days.
					</Typography>
					<ContactForm />
				</Grid>
			</Grid>
		</Box>
	);
}
