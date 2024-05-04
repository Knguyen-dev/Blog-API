import {
	Card,
	CardContent,
	Typography,
	CardHeader,
	Avatar,
} from "@mui/material";
import PropTypes from "prop-types";

export default function TestimonyCard({ name, title, message, image }) {
	return (
		<Card
			sx={{
				maxWidth: 350,
				overflow: "hidden",
			}}>
			<CardHeader
				title={name}
				titleTypographyProps={{
					variant: "h6",
				}}
				subheader={title}
				avatar={image && <Avatar src={image} alt={`${name}'s avatar`} />}
			/>
			<CardContent>
				<Typography>{message}</Typography>
			</CardContent>
		</Card>
	);
}

TestimonyCard.propTypes = {
	name: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.string,
	image: PropTypes.string,
};
