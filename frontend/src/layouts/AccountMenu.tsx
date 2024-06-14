import Logout from "@mui/icons-material/Logout";
import UploadIcon from "@mui/icons-material/Upload";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState, MouseEvent } from "react";
import useProfileNavigation from "../pages/Dashboard/Profile/hooks/useProfileNavigation";
import useManagePostsNavigation from "../pages/Dashboard/ManagePosts/hooks/useManagePostsNavigation";
import useLogout from "../hooks/useLogout";
import useAuthContext from "../hooks/useAuthContext";
import { verifyEditor, verifyAdmin } from "../utils/roleUtils";

import UserAvatar from "../components/img/UserAvatar";

/*
- Define the width of the menu. Then define a width for the text, and if the 
  text goes over that width, then we truncate it. Of course feel free to play
  around with truncateWidth to get the appearance you want
*/
const menuWidth = 275;
const truncateWidth = menuWidth - 75;

export default function AccountMenu() {
  const { auth } = useAuthContext();

  const logout = useLogout();
  const goToProfilePage = useProfileNavigation();
  const goToManagePostsPage = useManagePostsNavigation();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!auth.user) {
    throw "AccountMenu component tried to render, but 'auth.user' was undefined!";
  }

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /*
  + Handles a tab click on a menu item. Accepts 'callback' which 
    will be a tab item's own individual function. As a result 
    we'll be able to run the code for an individual tab, whilst 
    being able to close the account menu too.
  */
  const handleTabClick = (callback: () => void) => {
    handleClose();
    callback();
  };

  // Additional menu tabs after the header containing the user's information
  const menuArr = [
    [
      {
        icon: <PersonIcon fontSize="small" />,
        text: "My Account",
        id: 1,
        onClick: goToProfilePage,
        ariaLabel: "Go to user account page",
        visible: true,
      },
      {
        icon: <UploadIcon fontSize="small" />,
        text: "Create Post",
        id: 2,
        onClick: goToManagePostsPage,
        ariaLabel: "Go to manage posts page",

        // Only visible when you're an editor or admin
        visible: verifyAdmin(auth.user.role) || verifyEditor(auth.user.role),
      },
      {
        icon: <Logout fontSize="small" />,
        text: "Sign out",
        onClick: logout,
        id: 3,
        visible: true,
      },
    ],
  ];

  // Create markup for interactive menu items
  const menuItems = menuArr.map((sectionArr) => {
    // Create markup the tabs in each section
    const sectionContent = sectionArr.map((tabObj) => {
      if (tabObj.visible) {
        return (
          <MenuItem
            key={tabObj.id}
            aria-label={tabObj.ariaLabel}
            onClick={() => handleTabClick(tabObj.onClick)}>
            <ListItemIcon>{tabObj.icon}</ListItemIcon>
            {tabObj.text}
          </MenuItem>
        );
      }
    });

    // Append divider to the front of the array, which adds
    // a top divider in front of the markup of each new section
    sectionContent.unshift(<Divider />);
    return sectionContent;
  });

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
            {/* 
            - Neat thing is, if Avatar component has trouble loading the image, then 
              Avatar component will fall back to the child elements. So here if 
              we have problems loading hte image, then we'll use the initials.
            
            */}
            <UserAvatar
              fullName={auth.user.fullName}
              src={auth.user.avatarSrc}
            />
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
              width: menuWidth,
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
          }}
          tabIndex={-1}
          aria-label="Account Menu header">
          <UserAvatar fullName={auth.user.fullName} src={auth.user.avatarSrc} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* 
            - if you want typographies to wrap around, do whiteSpace: normal on sx
              sx. Here though, we prefer to truncate the names and emails if they're too long.

            - However here we're doing truncation. So according to the docs, we apply
              'noWrap' which means it's going to default to truncating, and we must 
              define a width so that mui can detect it. If text goes over 200px, then
              then the rest will be truncated with ellipses.
            */}
            <Typography
              component="span"
              fontSize={16}
              noWrap
              sx={{ width: truncateWidth }}>
              {auth.user.fullName}
            </Typography>
            <Typography component="span" noWrap sx={{ width: truncateWidth }}>
              {auth.user.email}
            </Typography>
          </Box>
        </MenuItem>

        {/* Interactable tabs for the account menu */}
        {menuItems}
      </Menu>
    </>
  );
}
