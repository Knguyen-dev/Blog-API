import ResponsiveDrawer from "../components/ResponsiveDrawer";

import HomeIcon from "@mui/icons-material/Home"; // most popular 'probably comments based'
import ThumbUpIcon from "@mui/icons-material/ThumbUp"; // most liked
import EventIcon from "@mui/icons-material/Event"; // most recent

import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import ScienceIcon from "@mui/icons-material/Science";
/*
- Have to think up some categories for my blog site
1. reviews; subcategories could be the games genres
2. guides; subcategories could be walkthroughs, tips and tricks, strategies 
3. commentary & lifestyle
4. Gaming News: Industry updates, release announcements, esports?, other major happenings
5. Tech; hardware review, PC Building, tech related news/discussion, software installation, trouble shooting, hardware setup

*/

const browseDrawer = [
	// First section
	{
		tabs: [
			{
				icon: <HomeIcon />,
				text: "Home",
			},
			{
				icon: <ThumbUpIcon />,
				text: "Top Rated",
			},
			{
				icon: <EventIcon />,
				text: "Recent",
			},
		],
	},

	// Explore section
	{
		title: "Explore",
		tabs: [
			{
				icon: <VideogameAssetIcon />,
				text: "Gaming",
			},
			{
				icon: <LiveTvIcon />,
				text: "Movies & Tv",
			},
			{
				icon: <NewspaperIcon />,
				text: "News",
			},
			{
				icon: <ScienceIcon />,
				text: "Science",
			},
			{
				icon: <PodcastsIcon />,
				text: "Commentary",
			},
			{
				icon: <LibraryMusicIcon />,
				text: "Music & Culture",
			},
		],
	},
];

export default function BrowsePage() {
	return (
		<div className="tw-flex">
			{/* Drawer for the browse page */}
			<ResponsiveDrawer
				drawerWidth={225}
				drawerArr={browseDrawer}
				desktopOpen={true}
			/>

			<main className="tw-flex-1">Main Browsing Page Content</main>
		</div>
	);
}
