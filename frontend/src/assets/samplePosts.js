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
		category: {
			title: "Gaming",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		category: {
			title: "Lifestyle and Culture",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		category: {
			title: "Reviews",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Richmond Shelter",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		category: {
			title: "Gaming",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title: "Phil Spencer on Helldive",
		category: {
			title: "Gaming",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		category: {
			title: "Gaming",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
	},
	{
		title:
			'Phil Spencer on Helldivers 2 Not Being on Xbox: "I\'m not exactly sure Who It Helps."',
		category: {
			title: "A long category title you know",
		},
		user: {
			username: "AStedM4n",
			fullName: "Alex Stedman",
			avatar:
				"https://yt3.googleusercontent.com/ytc/AIf8zZRbe_lMBoOtB7H2760lRkgFVdQB3-iph4yGEFt8dQ=s176-c-k-c0x00ffffff-no-rj",
			avatarInitials: "AS",
		},
		imgSrc:
			"https://assets-prd.ignimgs.com/2024/02/15/3e615c580c975861756151b1ee572db92502e73c213302c7-1707957131399.jpeg?crop=16%3A9&width=282&dpr=2",
		createdAt: "2024-03-15T22:50:59.005+00:00",
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
