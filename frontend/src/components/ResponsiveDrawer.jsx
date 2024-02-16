import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography, Fab } from "@mui/material";
import MiniDrawer from "./MiniDrawer";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, Fragment } from "react";
import PropTypes from "prop-types";

export default function ResponsiveDrawer({
	drawerWidth,
	drawerArr,
	desktopOpen,
}) {
	/*

  + All of these states are for the mobile drawer
  1. mobileOpen: Tracks when the Drawer is showing on the mobile 
    screens.
  2. setIsClosing: Tracks when we the drawer 'is closing' or is 
    in the process of closing.
  
  */
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	let drawer = (
		<div>
			{drawerArr.map((sectionObj, sectionIndex) => (
				<Fragment key={sectionIndex}>
					<List key={sectionIndex}>
						{/* Render title if it existts */}
						{sectionObj.title && (
							<ListItem
								disablePadding
								sx={{
									pointerEvents: "none",
								}}>
								<ListItemButton
									// Mess with the height to adjust the 'spacing between the list items
									sx={{
										height: 32,
										px: 2.5,
									}}>
									<Typography variant="h6">{sectionObj.title}</Typography>
								</ListItemButton>
							</ListItem>
						)}

						{/* Tabs for said section */}
						{sectionObj.tabs.map((tabObj, tabIndex) => (
							<ListItem key={`${sectionIndex}-${tabIndex}`} disablePadding>
								<ListItemButton>
									<ListItemIcon>{tabObj.icon}</ListItemIcon>
									<ListItemText primary={tabObj.text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
				</Fragment>
			))}
		</div>
	);

	return (
		<Box
			component="nav"
			sx={{
				flexShrink: { sm: 0 }, // Assuming our container is flexbox, don't shrink the sidebar container
			}}>
			{/* Position fixed button for toggling the mobile sidebar */}
			<Fab
				color="inherit"
				aria-label="open drawer"
				edge="start"
				onClick={handleDrawerToggle}
				size="small"
				sx={{
					display: { xs: "flex", sm: "none" },
					position: "fixed",
					bottom: 16,
					right: 16,
					alignItems: "center",
					justifyContent: "center",
				}}>
				{mobileOpen ? <CloseIcon /> : <MenuIcon />}
			</Fab>

			{/* Mobile sidebar, offcanvas that slides in. Since it's position fixed,
        we place a width on it so that it affects content in the normal/static flow. Meaning
        even if it's position fixed, we can simulate it like it's still affecting the regular
        page layout */}
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: "block", sm: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}>
				{drawer}
			</Drawer>

			{/* Desktop permanent sidebar. It can be collapsible to only show the icons, but
        we're not going to use it here. */}
			<MiniDrawer
				open={desktopOpen}
				drawerWidth={drawerWidth}
				sx={{ display: { xs: "none", sm: "block" } }}
				drawerArr={drawerArr}
			/>
		</Box>
	);
}

ResponsiveDrawer.propTypes = {
	desktopOpen: PropTypes.bool,
	drawerWidth: PropTypes.number,
	drawerArr: PropTypes.array,
};
