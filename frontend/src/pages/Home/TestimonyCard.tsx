import {
	Card,
	CardContent,
	Typography,
	CardHeader,
	Avatar,
} from "@mui/material";

interface TestimonyCardProps {
	name: string;
	title: string;
	message: string;
	image: string;
}

export default function TestimonyCard({
	name,
	title,
	message,
	image,
}: TestimonyCardProps) {
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
