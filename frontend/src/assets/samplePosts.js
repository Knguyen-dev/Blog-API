/*
+ Sample data:
1. Thumbnail
2. Title 
3. Poster's pfp, and Full name
4. Num comments and or likes
5. How long ago published

- Taking inspiration from youtube video and ign article layouts.

*/

const samplePosts = [
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		authorName: "Alex Stedman",
		numComments: 34,
		timePosted: "2 days ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title:
			'New Game Announcement: "Mystery of the Ancients". What an amazing and cinematic experience for the needy!',
		authorName: "GameNews2024",
		numComments: 15,
		timePosted: "5 hours ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Interview with Game Developer John Smith on "Future of Gaming"',
		authorName: "GamingInsider",
		numComments: 42,
		timePosted: "1 day ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Game Review: "Space Odyssey" - A Journey Beyond the Stars',
		authorName: "StarGazer",
		numComments: 87,
		timePosted: "3 days ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: "Top 10 Must-Play Indie Games of 2024",
		authorName: "IndieGameFan",
		numComments: 63,
		timePosted: "1 week ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Exclusive Look: Behind the Scenes of "Cybernetic War"',
		authorName: "TechGaming",
		numComments: 28,
		timePosted: "4 days ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Game Developer Spotlight: The Creative Minds Behind "Dreamscape"',
		authorName: "GameDevGuru",
		numComments: 11,
		timePosted: "6 hours ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Game Update: "Eternal Realm" Introduces New Quests and Challenges',
		authorName: "RealmExplorer",
		numComments: 36,
		timePosted: "2 days ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: 'Community Event: Join the "Legends of Gaming" Tournament!',
		authorName: "GamingCommunity",
		numComments: 50,
		timePosted: "1 day ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: "Opinion Piece: Are Mobile Games the Future of Gaming?",
		authorName: "GameDebate",
		numComments: 73,
		timePosted: "5 days ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
	{
		title: "Game Awards 2024: Celebrating the Best in Gaming",
		authorName: "GameAwards",
		numComments: 94,
		timePosted: "1 week ago",
		authorPfp:
			"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
		image:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
	},
];

export default samplePosts;
