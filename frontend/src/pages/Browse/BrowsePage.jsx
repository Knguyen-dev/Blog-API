import ResponsiveDrawer from "../../components/drawers/ResponsiveDrawer";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
import { Typography } from "@mui/material";

import PostCard from "./PostCard";
import { samplePosts } from "../../assets/samplePosts";
import { useEffect, useState } from "react";

const browseDrawer = [
	// First section
	{
		tabs: [
			{
				icon: <TrendingUpIcon />,
				text: "Most Popular",
				onClick: () => console.log("Searched for most popular"),
				id: 1,
			},
			{
				icon: <ThumbUpIcon />,
				text: "Top Rated",
				onClick: () => console.log("Searched for top rated"),
				id: 2,
			},
			{
				icon: <EventIcon />,
				text: "Recent",
				onClick: () => console.log("Searched for most recent"),
				id: 3,
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
				onClick: () => console.log("Searched for 'Gaming'"),
				id: 4,
			},
			{
				icon: <LiveTvIcon />,
				text: "Movies & Tv",
				onClick: () => console.log("Searched for 'Movies & Tv'"),
				id: 5,
			},
			{
				icon: <NewspaperIcon />,
				text: "News",
				onClick: () => console.log("Searched for 'News'"),
				id: 6,
			},
			{
				icon: <ScienceIcon />,
				text: "Science",
				onClick: () => console.log("Searched for 'Science'"),
				id: 7,
			},
			{
				icon: <PodcastsIcon />,
				text: "Commentary",
				onClick: () => console.log("Searched for 'Commentary'"),
				id: 8,
			},
			{
				icon: <LibraryMusicIcon />,
				text: "Music & Culture",
				onClick: () => console.log("Searched for 'Music & Culture'"),
				id: 9,
			},
		],
	},
];

/*

1. activeTabID: ID of the tab that's currently selected. Used
  for indicating which tab is currently selected for both the 
  offcanvas and the desktop sidebar.
- NOTE: When deicding whether to use indices or IDs as keys, 
  we must consider the stability. If the IDs of your items don't 
  change, then that's a good sign to use them as react can easily
  update and reorder items if necessary. If the order of your 
  list items can change, things can be added, removed, moved around, 
  then don't use indexes. Here try to use unique IDS, a combination
  of IDS and indexes or something. Using indexes can negative impact
  performance, in the cases of larger lists as well. In general 
  use stable and unique IDs.
*/
export default function BrowsePage() {
	const [activeTabID, setActiveTabID] = useState(null);

	/*
  - Loads and sets the default tab on page load:
  1. Get our default tab
  2. Run the logic for clicking that tab.
  */
	useEffect(() => {
		const defaultTab = browseDrawer[1].tabs[0];
		handleTabClick(defaultTab);
	}, []);

	/*
  + Handles tab clicks for the browsing page.
  1. Set the tab ID 
  2. Call the onClick function associated with that tab
  */
	const handleTabClick = (tabObj) => {
		setActiveTabID(tabObj.id);
		tabObj.onClick();
	};

	return (
		<div className="tw-flex tw-flex-1">
			<ResponsiveDrawer
				drawerWidth={225}
				drawerArr={browseDrawer}
				activeTabID={activeTabID}
				handleTabClick={handleTabClick}
			/>

			<main className="tw-p-8 tw-overflow-y-auto">
				<div className="tw-mb-4">
					<Typography variant="h5">Results for: Videogames</Typography>
				</div>
				<div className="tw-grid tw-gap-4 tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3">
					{samplePosts.map((postObj, index) => (
						<PostCard
							key={index}
							postObj={postObj}
							imageHeight={200}
							// NOTE: We let the width of the post be decided by the grid itself in this case
						/>
					))}
				</div>
			</main>
		</div>
	);
}
