/*
+ DashboardLayout: Layout for the dashboard. 


- BOOK MARK: If someone is redirected, to the 'profile' page, we need
  to select that tab as the active tab. So it looks like we may have to lift up the state so that 
  we can control the activeTabID, as we probably shouldn't define it in the ResponsiveDrawer if 
  we're going to be reusing it.
*/

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ResponsiveDrawer from "../components/drawers/ResponsiveDrawer";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupsIcon from "@mui/icons-material/Groups";

import useAuthContext from "../hooks/useAuthContext";
import { useState, useEffect } from "react";

export default function DashboardLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	const { auth } = useAuthContext();

	const [activeTabID, setActiveTabID] = useState(null);

	/*
  + Effect: When the user navigates to the dashboard for the first time
    we want to have the tab visually selected, regardless of what tab they're on. 

  1. Get the path. If the path ends with '/', then we remove the slash so that 
    we can map it to a tabID. This is because "/some_path" and "/some_path/" route 
    to the same place, so we 'normalize' the path to make it easier for us to map the 
    tabIDs.
  2. Then set the activeTabID.

  - NOTE: 
  
  1. Let this effect run whenever location.pathname changes. This is because
    there are many places in the application that allow the user to navigate to each
    of these tabs. The account menu's buttons, and the buttons created for each tab 
    object are examples of this. Rather than letting those outside sources try to 
    control the activeTabID, we centralize the logic within the effect, so whenever 
    we route to the dashboard, the effect will set the activeTabID appropriately.

  2. If you change the routes in the App.jsx, then you'll need to change them
    accordingly in the DashboardLayout as well. Also if you wanted to change 
    the tabIDs or add more tabs, just make sure you match the tab IDs in the 
    arrays such as 'commonTabs' and the useEffect to correctly track the 
    active tab.
  */
	useEffect(() => {
		const path = location.pathname;
		const normalizePath = path.endsWith("/") ? path.slice(0, -1) : path;

		// Get the tabID based on the client's route
		const tabID = {
			"/dashboard": 1,
			"/dashboard/manage-posts": 2,
			"/dashboard/team": 3,
		}[normalizePath];

		// Set the tab ID
		setActiveTabID(tabID);

		// Run effect only once after component mounts.
	}, [location.pathname]);

	/*
  - Tabs:
  1. commonTabs: Tabs available to all users regardless of their role.
  2. editorTabs: Tabs only available to editors. 
  3. adminTabs: Tabs only available to admins
  */
	const commonTabs = [
		{
			icon: <AccountCircleIcon />,
			text: "Profile",
			onClick: () => navigate(""), // navigate to index route, which is '/dashboard'. You could also pass '/dashboard'
			id: 1,
		},
	];

	/*
  + Tabs for Editors and Admins!
  - Here you should be able to see posts that you created (editor), or 
    if you're an admin, you should be able to see all posts. Of course
    Editors are only able to edit their own posts or posts that they've
    contributed to, and admins are able to do it all. Admins should be 
    able to delete, archive (unpublish a post), and edit it. Of course
    anyone who edits a post should be put on the contributors list.
  */
	const editorTabs = [
		{
			icon: <PostAddIcon />,
			text: "Manage Posts",
			onClick: () => navigate("manage-posts"),
			id: 2,
		},
	];

	/*
  + Tabs for Admins
  - Tab for us to see all editors and admins on our team
    Let the admin be able to add an existing user to the team.
    This way members of the team can create accounts and then admins
    can add them to the team as editors or fellow admins.
  */
	const adminTabs = [
		{
			icon: <GroupsIcon />,
			text: "Team",
			onClick: () => navigate("team"),
			id: 3,
		},
	];

	const dashboardDrawer = [
		// Just going to be one section for this sidebar
		{
			tabs: [
				...commonTabs, // add common tabs automatically

				// If user is an editor or admin, add the editorTabs
				...(auth.user.role == import.meta.env.VITE_ROLE_EDITOR ||
				auth.user.role == import.meta.env.VITE_ROLE_ADMIN
					? editorTabs
					: []),

				// Then if user is an admin, add the admin tabs
				...(auth.user.role == import.meta.env.VITE_ROLE_ADMIN ? adminTabs : []),
			],
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
			<main className="tw-p-10 tw-flex-1 tw-overflow-y-scroll">
				<Outlet />
			</main>
		</Box>
	);
}
