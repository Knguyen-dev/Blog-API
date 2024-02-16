import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

import UploadIcon from "@mui/icons-material/Upload";

import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";

import { useState, Fragment } from "react";
import useLogout from "../../hooks/useLogout";

import PropTypes from "prop-types";

export default function AccountMenu({ user }) {
	const logout = useLogout();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	console.log("User's Role: ", user.role);
	console.log("Vite user role: ", import.meta.env.VITE_ROLE_USER);

	// Additional menu tabs after the
	const menuArr = [
		[
			{
				icon: <PersonIcon fontSize="small" />,
				text: "My Account",
			},

			/*
      - If they aren't a user, they're an admin or editor, so they can have the option
			for creating post. Later though, you'll probably want to create functions to authorize
			users.
      
      - NOTE: In .env files, our values will always be strings so if we're comparing 
        numbers, we need to convert them like we did here, or do non-strict comparisons.
      */

			user.role !== parseInt(import.meta.env.VITE_ROLE_USER) && {
				icon: <UploadIcon fontSize="small" />,
				text: "Create Post",
			},
			{
				icon: <Logout fontSize="small" />,
				text: "Sign out",
				onClick: logout,
			},
		],
	];

	return (
		<>
			<Box>
				{/* Button for opening the account menu */}
				<Tooltip title="Account settings">
					<IconButton
						onClick={handleClick}
						size="small"
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}>
						<Avatar>{user.username.slice(0, 1).toUpperCase()}</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						elevation: 0,
						// Styling the paper
						sx: {
							width: 275,
							overflow: "visible",
							filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
							mt: 1.5,
							"& .MuiAvatar-root": {
								width: 40,
								height: 40,
								ml: -0.5,
								mr: 1,
							},
							"&::before": {
								content: '""',
								display: "block",
								position: "absolute",
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: "background.paper",
								transform: "translateY(-50%) rotate(45deg)",
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
				{/* Header item that shows the user and their info */}
				<MenuItem
					sx={{
						pointerEvents: "none",
					}}>
					<Avatar>{user.username.slice(0, 1).toUpperCase()}</Avatar>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						{/* 
            - if you want typographies to wrap around, do whiteSpace: normal on sx
              sx. Here though, we prefer to truncate the names and emails if they're too long.

            - However here we're doing truncation. So according to the docs, we apply
              'noWrap' which means it's going to default to truncating, and we must 
              define a width so that mui can detect it. If text goes over 200px, then
              then the rest will be truncated with ellipses.
            */}
						<Typography variant="span" fontSize={16} noWrap sx={{ width: 200 }}>
							{user.fullName}
						</Typography>
						<Typography variant="span" noWrap sx={{ width: 200 }}>
							{user.email}
						</Typography>
					</Box>
				</MenuItem>

				<Divider />

				{/* Interactable tabs for the account menu */}
				{menuArr.map((sectionArr, sectionIndex) => (
					<Fragment key={sectionIndex}>
						{sectionArr.map((tabObj, tabIndex) => (
							<MenuItem
								key={tabIndex}
								onClick={tabObj.onClick && tabObj.onClick}>
								<ListItemIcon>{tabObj.icon}</ListItemIcon>
								{tabObj.text}
							</MenuItem>
						))}

						{/* For all sections that aren't the last one, render a divider after it. */}
						{sectionIndex !== menuArr.length - 1 && <Divider />}
					</Fragment>
				))}
			</Menu>
		</>
	);
}

AccountMenu.propTypes = {
	user: PropTypes.object,
};
