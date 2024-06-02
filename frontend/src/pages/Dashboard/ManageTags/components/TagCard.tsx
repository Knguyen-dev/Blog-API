import {
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
} from "@mui/material";
import { ITag } from "../../../../types/Post";

interface ITagCardProps {
	tag: ITag;
	handleDelete: () => void;
	handleEdit: () => void;
	className?: string;
}

export default function TagCard({
	tag,
	handleDelete,
	handleEdit,
	className,
}: ITagCardProps) {
	return (
		<Card className={className}>
			<CardContent sx={{ paddingBottom: 1 }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}>
					<Typography sx={{ fontSize: 14 }} color="text.secondary">
						Tag
					</Typography>
					<Typography variant="h5" component="div">
						{tag.title}
					</Typography>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					variant="contained"
					color="warning"
					size="small"
					onClick={handleDelete}>
					Delete
				</Button>
				<Button variant="contained" size="small" onClick={handleEdit}>
					Edit
				</Button>
			</CardActions>
		</Card>
	);
}
