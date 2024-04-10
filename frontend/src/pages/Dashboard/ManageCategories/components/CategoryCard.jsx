import {
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
} from "@mui/material";
import PropTypes from "prop-types";

CategoryCard.propTypes = {
	category: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
	}),
	handleDelete: PropTypes.func,
	handleEdit: PropTypes.func,
	className: PropTypes.string,
};

export default function CategoryCard({
	category,
	handleDelete,
	handleEdit,
	className,
}) {
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
					variant="outlined"
					color="warning"
					size="small"
					onClick={handleDelete}>
					Delete
				</Button>
				<Button variant="outlined" size="small" onClick={handleEdit}>
					Edit
				</Button>
			</CardActions>
		</Card>
	);
}
