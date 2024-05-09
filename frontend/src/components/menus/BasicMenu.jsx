/*


*/

import { Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
const ITEM_HEIGHT = 48;

BasicMenu.propTypes = {
	open: PropTypes.bool,
	anchorEl: PropTypes.object, // It's an html element
	items: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			onClick: PropTypes.func.isRequired,
		})
	),
	handleClose: PropTypes.func,
};

export default function BasicMenu({ open, anchorEl, items, handleClose }) {
	return (
		<Menu
			id="long-menu"
			MenuListProps={{
				"aria-labelledby": "long-button",
			}}
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			slotProps={{
				paper: {
					// maxHeight; apparently not a property
					height: ITEM_HEIGHT * 4.5,
					width: "20ch",
				},
			}}>
			{items.map((item, index) => (
				<MenuItem
					key={index}
					onClick={item.onClick}
					aria-label={item.ariaLabel}>
					{item.label}
				</MenuItem>
			))}
		</Menu>
	);
}
