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
		/*
    + Styling explained:
    - flex-1 ensures we get the ensure space for the app-layout. Then
      'tw-w-full' will help the data-grid scroll correctly. Then 
      for our 'main' we do flex-1 to ensure the pages we're rendering
      get the rest of the space not occupied by ResponsiveDrawer. Then 
      we overflow auto to ensure we only get scrollbars when we need it.
      The vertical scrolling for when there's a lot of vertical content, 
      but our horizontal scrolling also helps things such as our data-grid 
      become fully responsive and viewable.
    
     */
		<Box className="tw-flex tw-flex-1 tw-w-full">
			<ResponsiveDrawer
				drawerWidth={225}
				drawerArr={dashboardDrawer}
				activeTabID={activeTabID}
				handleTabClick={handleTabClick}
			/>
			<main className="tw-p-4 tw-flex-1 tw-overflow-auto">
				<Outlet />
			</main>
		</Box>
	);
}
