import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PropTypes from "prop-types";
import { Typography } from "@mui/material";

import { Fragment } from "react";

/*
- openedMixin and closedMixin: They are just functions that 
  take the 'theme' object you provided in Mui's ThemeProvider, and
  gets their values. Then it creates style objects to apply

- Mui's way of making a styled component. We imported a 'MuiDrawer' and 
  this way we can create our own drawer component.

+ About props:
- So our 'Drawer' accepts three props, theme open, and drawerWidth.
  So when we instantiate the Drawer component we can pass these 
  props in like normal. Then in styled-components, we can access those 
  props and potentially do some styling with them!

*/

const openedMixin = (theme, drawerwidth) => ({
	width: drawerwidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, drawerwidth }) => ({
	width: drawerwidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	/*
  - Target so that our sidebar is in the normal flow.

  - NOTE: Be sure to target the main classes like this. If you target 
    a dynamically created classname, such as ".39jcerj-mui-paper" or something
    and you apply some style to it. That style probably won't transfer over when you
    change themes to 'dark'. This is because it'll remove that class and apply the 
    dark mode version of it.
  */
	".MuiPaper-root": {
		position: "static",
	},
	...(open && {
		...openedMixin(theme, drawerwidth),
		"& .MuiDrawer-paper": openedMixin(theme, drawerwidth),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export default function MiniDrawer({
	open,
	sx,
	drawerWidth,
	drawerArr,
	handleTabClick,
	activeTabID,
}) {
	const drawer = drawerArr.map((sectionObj, sectionIndex) => (
		<Fragment key={sectionIndex}>
			<List>
				{/* - Title of said section: We don't want titles to be clickable
          and we want them to disappear when we collapse them */}
				{sectionObj.title && (
					<ListItem
						disablePadding
						sx={{
							display: `${open ? "block" : "none"}`,
							pointerEvents: "none",
						}}>
						<ListItemButton
							// Mess with the height to adjust the 'spacing between the list items
							sx={{
								height: 32,
								justifyContent: open ? "initial" : "center",
								px: 2.5,
							}}>
							<Typography variant="h6" sx={{ opacity: open ? 1 : 0 }}>
								{sectionObj.title}
							</Typography>
						</ListItemButton>
					</ListItem>
				)}

				{sectionObj.tabs.map((tabObj) => (
					<ListItem key={tabObj.id} disablePadding sx={{ display: "block" }}>
						<ListItemButton
							// Mess with the height to adjust the 'spacing between the list items
							sx={{
								height: 48,
								justifyContent: open ? "initial" : "center",
								px: 2.5,
							}}
							onClick={() => handleTabClick(tabObj)}
							selected={activeTabID === tabObj.id}>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : "auto",
									justifyContent: "center",
								}}>
								{tabObj.icon}
							</ListItemIcon>
							<ListItemText
								primary={tabObj.text}
								sx={{ opacity: open ? 1 : 0 }}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
		</Fragment>
	));

	return (
		<Drawer
			variant="permanent"
			open={open}
			sx={sx} // this typically defines our responsive styles
			/*
      - Since 'drawerWidth' isn't an actual prop defined on this component, we can 
        pass it as a prop by including it as a custom attribute. Do this by lowercasing
        the name of the property. Then just pass it in and accomodate it in the 'Drawer'
        styled component.
      */
			drawerwidth={drawerWidth}>
			{drawer}
		</Drawer>
	);
}

MiniDrawer.propTypes = {
	open: PropTypes.bool,
	sx: PropTypes.object,
	drawerWidth: PropTypes.number,
	drawerArr: PropTypes.array,
	handleTabClick: PropTypes.func,
	activeTabID: PropTypes.number,
};
