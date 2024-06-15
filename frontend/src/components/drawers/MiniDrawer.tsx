/**
 * Controlled drawer (sidebar) componnet that's shown on smaller screens. This has the behavior of a
 * off-canvas, so on mobile screens you can toggle opening and closing the MiniDrawer, and it slides in
 * and out like an offcanvas.
 */

import { Fragment } from "react";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { DrawerTab, DrawerSection } from "./ResponsiveDrawer";

// Styles the opening transition and state
const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// Styles the closing animation and css
const closedMixin = (theme: Theme): CSSObject => ({
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

// Styles the drawer component itself
const Drawer = styled(MuiDrawer, {
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

interface MiniDrawerProps<T extends DrawerTab> {
  open: boolean;
  sx?: object;
  drawerWidth: number;
  drawerArr: DrawerSection<T>[];
  activeTabID: number;
  handleTabClick: (tabObj: T) => void;
  className?: string;
}

export default function MiniDrawer<T extends DrawerTab>({
  open,
  sx,
  drawerWidth,
  drawerArr,
  handleTabClick,
  activeTabID,
}: MiniDrawerProps<T>) {
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
