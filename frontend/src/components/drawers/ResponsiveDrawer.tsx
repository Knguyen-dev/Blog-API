import {
	Box,
	Divider,
	Drawer,
	Typography,
	Fab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import MiniDrawer from "./MiniDrawer";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, Fragment, ReactNode } from "react";

/*
- NOTE: At minimum a DrawerTab object needs to contain an id, 
 text (the title of the tab), and then optionally an icon.

 We will then let our generic T inherit this DrawerTab interface.
 So the user should pass in an object 'T' to represent a tab. This 
 object can have whatever properties, but it just needs to have 
 certain attributes defined in DrawerTab interface.

*/
export interface DrawerTab {
	id: number;
	icon?: ReactNode;
	text: string;
}

export interface DrawerSection<T extends DrawerTab> {
	title?: string;
	tabs: T[];
}

interface ResponsiveDrawerProps<T extends DrawerTab> {
	drawerWidth: number;
	drawerArr: DrawerSection<T>[];
	activeTabID: number;
	handleTabClick: (tabObj: T) => void;
	className?: string;
}

export default function ResponsiveDrawer<T extends DrawerTab>({
	drawerWidth,
	drawerArr,
	activeTabID,
	handleTabClick,
	className,
}: ResponsiveDrawerProps<T>) {
	/*
  1. mobileOpen: Tracks when the Drawer is showing on the mobile 
    screens.
  */
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerClose = () => {
		setMobileOpen(false);
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<div>
			{drawerArr.map((sectionObj, sectionIndex) => (
				<Fragment key={sectionIndex}>
					<List key={sectionIndex}>
						{/* Render title for section if it existts */}
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
						{sectionObj.tabs.map((tabObj) => {
							return (
								<ListItem key={tabObj.id} disablePadding>
									<ListItemButton
										onClick={() => handleTabClick(tabObj)}
										selected={activeTabID === tabObj.id}>
										<ListItemIcon>{tabObj.icon}</ListItemIcon>
										<ListItemText primary={tabObj.text} />
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
					<Divider />
				</Fragment>
			))}
		</div>
	);

	return (
		<Box component="nav" className={className}>
			{/* Position fixed button for toggling the mobile sidebar */}
			<Fab
				aria-label="open drawer"
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
				open={true} // so the collapsible drawer is fully visible
				drawerWidth={drawerWidth}
				sx={{
					display: { xs: "none", sm: "block" }, // responsive stylings that complement the offcanvas
				}}
				// Pass the drawer array, since the markup for MiniDrawer is different from
				// our offcanvas drawer.
				drawerArr={drawerArr}
				handleTabClick={handleTabClick}
				activeTabID={activeTabID}
			/>
		</Box>
	);
}
