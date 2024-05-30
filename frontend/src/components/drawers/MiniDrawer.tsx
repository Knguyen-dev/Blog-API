import { Fragment, ReactNode } from "react";
import { styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const openedMixin = (theme: Theme, drawerWidth: number) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme: Theme) => ({
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

interface DrawerProps {
	open: boolean;
	drawerWidth: number;
}

const Drawer = styled(MuiDrawer as any, {
	shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<DrawerProps>(({ theme, open, drawerWidth }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	"& .MuiPaper-root": {
		position: "static",
	},
	...(open && {
		...openedMixin(theme, drawerWidth),
		"& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

interface DrawerTab {
	id: number;
	icon?: ReactNode;
	text: string;
}

interface DrawerSection {
	title?: string;
	tabs: DrawerTab[];
}

interface MiniDrawerProps {
	open: boolean;
	sx?: object;
	drawerWidth: number;
	drawerArr: DrawerSection[];
	activeTabID: number;
	handleTabClick: (tabObj: DrawerTab) => void;
	className?: string;
}

export default function MiniDrawer({
	open,
	sx,
	drawerWidth,
	drawerArr,
	handleTabClick,
	activeTabID,
}: MiniDrawerProps) {
	const drawer = drawerArr.map((sectionObj, sectionIndex) => (
		<Fragment key={sectionIndex}>
			<List>
				{sectionObj.title && (
					<ListItem
						disablePadding
						sx={{
							display: `${open ? "block" : "none"}`,
							pointerEvents: "none",
						}}>
						<ListItemButton
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
		<Drawer variant="permanent" open={open} sx={sx} drawerWidth={drawerWidth}>
			{drawer}
		</Drawer>
	);
}
