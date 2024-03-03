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

const sampleTablePosts = [
	{
		id: 1,
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		author: "Alex Stedman",
		category: "Gaming News",
		datePosted: "November 25th, 2024",
		status: "Published",
	},
	{
		id: 2,
		title:
			'New Game Announcement: "Mystery of the Ancients". What an amazing and cinematic experience for the needy!',
		author: "GameNews2024",
		category: "New Releases",
		datePosted: "December 13th, 2024",
		status: "Draft",
	},
	{
		id: 3,
		title: 'Interview with Game Developer John Smith on "Future of Gaming"',
		author: "GamingInsider",
		category: "Interviews",
		datePosted: "August 27th, 2024",
		status: "Published",
	},
	{
		id: 4,
		title:
			"Exploring the World of Virtual Reality: A Deep Dive into VR Technology",
		author: "VRExplorer",
		category: "Technology",
		datePosted: "September 15th, 2024",
		status: "Published",
	},
	{
		id: 5,
		title:
			"The Rise of Mobile Gaming: Trends and Innovations in the Mobile Game Industry",
		author: "MobileGuru",
		category: "Gaming",
		datePosted: "October 3rd, 2024",
		status: "Draft",
	},
	{
		id: 6,
		title:
			"Behind the Scenes: Development Process of the Latest AAA Game Title",
		author: "GameDevInsider",
		category: "Game Development",
		datePosted: "November 8th, 2024",
		status: "Published",
	},
	{
		id: 7,
		title: "Unveiling the Next-Gen Gaming Consoles: Features, Specs, and More",
		author: "TechEnthusiast",
		category: "Gaming Hardware",
		datePosted: "December 20th, 2024",
		status: "Draft",
	},
	{
		id: 8,
		title: "The Impact of Cloud Gaming: Revolutionizing the Gaming Experience",
		author: "CloudGamingInsider",
		category: "Gaming Technology",
		datePosted: "January 10th, 2025",
		status: "Draft",
	},
	{
		id: 9,
		title:
			"E-Sports Industry Growth: A Look into Competitive Gaming Phenomenon",
		author: "E-SportsObserver",
		category: "E-Sports",
		datePosted: "February 5th, 2025",
		status: "Published",
	},
	{
		id: 10,
		title:
			"The Future of Augmented Reality in Gaming: Enhancing Realism and Immersion",
		author: "ARGameDev",
		category: "Gaming Technology",
		datePosted: "March 20th, 2025",
		status: "Draft",
	},
	{
		id: 11,
		title:
			"The Art of Game Design: Crafting Immersive Worlds and Engaging Experiences",
		author: "GameDesignGuru",
		category: "Game Development",
		datePosted: "July 10th, 2025",
		status: "Draft",
	},
	{
		id: 12,
		title:
			"Gaming and Mental Health: Exploring the Positive and Negative Effects",
		author: "MentalHealthGamer",
		category: "Gaming Psychology",
		datePosted: "August 8th, 2025",
		status: "Published",
	},
	{
		id: 13,
		title:
			"The Future of Console Gaming: Predictions and Expectations for Next Decade",
		author: "ConsoleFuture",
		category: "Gaming Hardware",
		datePosted: "September 12th, 2025",
		status: "Draft",
	},
	{
		id: 14,
		title:
			"The Role of Sound Design in Games: Creating Atmosphere and Immersion",
		author: "SoundDesignExpert",
		category: "Game Development",
		datePosted: "October 18th, 2025",
		status: "Published",
	},
	{
		id: 15,
		title:
			"Indie Game Spotlight: Hidden Gems and Rising Stars of the Indie Scene",
		author: "IndieGameReviewer",
		category: "Indie Games",
		datePosted: "November 7th, 2025",
		status: "Draft",
	},
	{
		id: 16,
		title:
			"Gaming Communities and Social Dynamics: Building Connections in Virtual Worlds",
		author: "CommunityBuilder",
		category: "Gaming Culture",
		datePosted: "December 22nd, 2025",
		status: "Draft",
	},
	{
		id: 17,
		title:
			"The Intersection of Art and Technology: Exploring Visual Aesthetics in Games",
		author: "ArtTechEnthusiast",
		category: "Gaming Design",
		datePosted: "January 5th, 2026",
		status: "Draft",
	},
	// Add more posts here if needed
];

export { samplePosts, sampleTablePosts };
