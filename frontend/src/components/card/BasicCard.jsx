import { Card, CardActions, CardContent } from "@mui/material";
import PropTypes from "prop-types";

BasicCard.propTypes = {
	content: PropTypes.element.isRequired,
	actions: PropTypes.element.isRequired,
	className: PropTypes.element,
};

export default function BasicCard({ content, actions, className }) {
	return (
		<Card sx={{ minWidth: 275 }} className={className}>
			<CardContent sx={{ paddingBottom: 1 }}>{content}</CardContent>
			<CardActions>{actions}</CardActions>
		</Card>
	);
}
