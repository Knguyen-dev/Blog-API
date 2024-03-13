/*
+ BasicAccordion: Simple accordion component that allows us to create one accordion.
*/

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
export default function BasicAccordion({
	expanded,
	handleChange,
	headerTitle,
	children,
	id,
}) {
	return (
		<Accordion expanded={expanded} onChange={handleChange}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`${id}-content`}
				id={`${id}-header`}>
				<Typography sx={{ width: "33%", flexShrink: 0 }}>
					{headerTitle}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	);
}
BasicAccordion.propTypes = {
	expanded: PropTypes.bool,
	handleChange: PropTypes.func,
	headerTitle: PropTypes.string,
	children: PropTypes.element,
	id: PropTypes.string,
	ariaControls: PropTypes.string,
};
