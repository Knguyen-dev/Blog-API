/*
+ DashboardLayout: Layout for the dashboard. 

+ Tabs for Editors and Admins!
- Here you should be able to see posts that you created (editor), or 
  if you're an admin, you should be able to see all posts. Of course
  Editors are only able to edit their own posts or posts that they've
  contributed to, and admins are able to do it all. Admins should be 
  able to delete, archive (unpublish a post), and edit it. Of course
  anyone who edits a post should be put on the contributors list.

+ Tabs for Admins
- Tab for us to see all editors and admins on our team
  Let the admin be able to add an existing user to the team.
  This way members of the team can create accounts and then admins
  can add them to the team as editors or fellow admins.
*/

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupsIcon from "@mui/icons-material/Groups";

import useAuthContext from "../hooks/user/useAuthContext";

import { useState, useEffect } from "react";

export default function DashboardLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const { auth } = useAuthContext();
	const [activeTabID, setActiveTabID] = useState(null);

	const tabs = [
		{
			icon: <AccountCircleIcon />,
			text: "Profile",
			onClick: () => navigate(""),
			id: 1,
			visible: true,
		},
		{
			icon: <PostAddIcon />,
			text: "Manage Posts",
			onClick: () => navigate("manage-posts"),
			id: 2,
			visible:
				auth.user.role === parseInt(import.meta.env.VITE_ROLE_EDITOR) ||
				auth.user.role === parseInt(import.meta.env.VITE_ROLE_ADMIN),
		},
		{
			icon: <GroupsIcon />,
			text: "Team",
			onClick: () => navigate("team"),
			id: 3,
			visible: auth.user.role === parseInt(import.meta.env.VITE_ROLE_ADMIN),
		},
	];

	/*
  + Effect:  Set the active tab ID when the user navigates to the dashboard.
   This effect runs whenever the location pathname changes.

  1. Get the path. If the path ends with '/', then we remove the slash so that 
    we can map it to a tabID. This is because "/some_path" and "/some_path/" route 
    to the same place, so we 'normalize' the path to make it easier for us to map the 
    tabIDs.
  2. Then set the activeTabID.
  */
	useEffect(() => {
		const path = location.pathname;
		const normalizePath = path.endsWith("/") ? path.slice(0, -1) : path;

		setActiveTabID(
			{
				"/dashboard": 1,
				"/dashboard/manage-posts": 2,
				"/dashboard/team": 3,
			}[normalizePath]
		);

		// Run effect only once after component mounts.
	}, [location.pathname]);

	const dashboardDrawer = [
		// Just going to be one section for this sidebar
		{
			tabs: tabs.filter((tab) => tab.visible),
		},
	];

	/*
  + Handles tab clicks for the DashboardLayout:
  
  1. Run the onClick() function for the tab that was clicked.
  */
	const handleTabClick = (tabObj) => {
		tabObj.onClick();
	};

	return (
		<Box className="tw-flex tw-flex-1 ">
			{/* Image and avatar here */}
			<ResponsiveDrawer
				drawerWidth={225}
				drawerArr={dashboardDrawer}
				activeTabID={activeTabID}
				handleTabClick={handleTabClick}
			/>

			{/* Pages for the user dashboard; do flex 1 to give the pages we're rendering
        the full space. Also do overflow-y-scroll so that the pages we render are able
        to be scrolled, but at the same time, our Header and Sidebar retain their positions
        if those are scrolled. */}
			<main className="tw-p-4 tw-flex-1 tw-overflow-y-scroll">
				<Outlet />
			</main>
		</Box>
	);
}
