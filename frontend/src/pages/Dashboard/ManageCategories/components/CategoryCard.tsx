import {
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
} from "@mui/material";
import { ICategory } from "../../../../types/Post";

interface ICategoryCardProps {
	category: ICategory;
	handleDelete: () => void;
	handleEdit: () => void;
	className?: string;
}

export default function CategoryCard({
	category,
	handleDelete,
	handleEdit,
	className,
} : ICategoryCardProps) {
	return (
		<Card className={className}>
			<CardContent sx={{ paddingBottom: 1 }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
					}}>
					<Typography sx={{ fontSize: 14 }} color="text.secondary">
						Category
					</Typography>
					<Typography variant="h5" component="div">
						{category.title}
					</Typography>
					<Typography variant="body2">{category.description}</Typography>
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
