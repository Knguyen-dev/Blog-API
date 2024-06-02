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

- NOTE on activeTabID: You should define an id on every tab rather than
    rely on index BECAUSE there may be mutiple 'sections' containing tabs
    rather than one. 
    section1 = { 
      tab1,
      tab2,
      tab3
    }
    section2 = {  
      tab4,
      tab5,
      tab6,
    }

    If we relied on indexing in our components, index 0 would highlight two
    different tabs due to them being in different sections:
    section1 = {
      tab0,
      tab1,
      tab2
    }
    section2 = {
      tab0,
      tab1,
      tab2,
    }
*/

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import ResponsiveDrawer, {DrawerTab} from "../../components/drawers/ResponsiveDrawer";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/Tag";
import { useState, useEffect, useMemo, ReactNode } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { verifyAdmin, verifyEditor } from "../../utils/roleUtils";


// Define an interface for a tab in the DashboardLayout
interface DashboardTab extends DrawerTab {
	path: string;
	onClick: () => void;
	visible: boolean;
}


export default function DashboardLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const { auth } = useAuthContext();

	/*
	- activeTabID: The id of the tab that's currently active or selected. In this 
	case, each tab correlates to a route/page. So if you're on the 'Profile' page, 
	then the 'Profile' tab, a button that routes to the 'Profile' page, will be active
	AND it will be 'highlighted' to indicate that you're on that tab or page.
	
	- NOTE: By default we'll set this to 0. This is merely for TypeScript purposes, and after the 
	first render, our effect will run to correctly set the activeTabID and visually highlight the
	tab that the user is on in the ResponsiveDrawer.
	*/
	const [activeTabID, setActiveTabID] = useState<number>(0);

	// Tabs for the sidebar; auth.user will be defined since this component is behind a ProtectedRoute component
	const tabs: DashboardTab[] = useMemo(() => {
		return [
			{
				id: 1,
				icon: <AccountCircleIcon />,
				text: "Profile",
				path: "/dashboard",
				onClick: () => navigate(""),
				visible: true,
			},
			{
				id: 2,
				icon: <PostAddIcon />,
				text: "Manage Posts",
				path: "/dashboard/manage-posts",
				onClick: () => navigate("manage-posts"),
				visible:
					// Visible if user is an editor or admin
					verifyEditor(auth.user!.role) || verifyAdmin(auth.user!.role)
			},
			{
				id: 3,
				icon: <CategoryIcon />,
				text: "Manage Categories",
				path: "/dashboard/manage-categories",
				onClick: () => navigate("manage-categories"),
				visible: verifyEditor(auth.user!.role) || verifyAdmin(auth.user!.role)
			},
			{
				id: 4,
				icon: <TagIcon />,
				text: "Manage Tags",
				path: "/dashboard/manage-tags",
				onClick: () => navigate("manage-tags"),
				visible: verifyEditor(auth.user!.role) || verifyAdmin(auth.user!.role)
			},
			{
				id: 5,
				icon: <GroupsIcon />,
				text: "Team",
				path: "/dashboard/team",
				onClick: () => navigate("team"),

				// Only visible to admin users
				visible: verifyAdmin(auth.user!.role)
			},
		];
	}, [auth.user!.role, navigate]);

	/*
  + Effect:  Set the active tab ID when the user navigates to the dashboard.
   This effect runs whenever the location pathname changes. This then results 
   to the highlighting for the active tab.
  2. Then set the activeTabID.
  */
	useEffect(() => {

		/*
		Get the path. If the path ends with '/', then we remove the slash so that 
		we can map it to a tabID. This is because "/some_path" and "/some_path/" route 
		to the same place, so we 'normalize' the path to make it easier for us to map the 
		tabIDs.
		*/
		const path = location.pathname;
		const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

		const pathMap: {[key: string]: number}  = {};
		tabs.map((tab) => {
			pathMap[tab.path] = tab.id;
		});

		setActiveTabID(pathMap[normalizedPath]);

		// Run effect only once after component mounts.
	}, [location.pathname, tabs]);

	const dashboardDrawer = [
		// Just going to be one section for this dashboard sidebar
		{
			tabs: tabs.filter((tab) => tab.visible),
		},
	];

	/*
	+ Handles tab clicks for the DashboardLayout:
	1. Run the onClick() function for the tab that was clicked.

	- NOTE: Why not use tabObj.onClick() in the ResponsiveDrawer and removing handleTabClick
		all together. By passing handleTabClick, it makes it easier to do things such as call 
		the .onClick, but also potentially do other things with access to data only available in the DashboardLayout.
	*/
	const handleTabClick = (tabObj: DashboardTab) => {
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
			<ResponsiveDrawer<DashboardTab>
				drawerWidth={225}
				drawerArr={dashboardDrawer}
				activeTabID={activeTabID}
				handleTabClick={handleTabClick}
			/>
			<Box className="tw-p-4 tw-flex-1">
				<Outlet />
			</Box>
		</Box>
	);
}
