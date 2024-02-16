import { Fab, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import PropTypes from "prop-types";

export default function NotificationBellBtn({
	active,
	onClick,
	size,
	className,
}) {
	return (
		<Tooltip title="Notifications">
			<Fab className={className} onClick={onClick} size={size}>
				{active ? <NotificationsIcon /> : <NotificationsNoneIcon />}
			</Fab>
		</Tooltip>
	);
}

NotificationBellBtn.propTypes = {
	active: PropTypes.bool,
	onClick: PropTypes.func,
	className: PropTypes.string,
	size: PropTypes.string,
	numNotifications: PropTypes.number,
};
