interface IUser {
	_id: string;
	email: string;
	username: string;
	fullName: string;
	role: number;
	lastLogin: string;
	avatarSrc: string;
	avatarInitials: string;
}

interface ICategory {
	_id: string;
	title: string;
	description: string;
	slug: string;
}

interface ITag {
	_id: string;
	title: string;
	slug: string;
}

interface IPost {
	_id: string;
	user: IPostAuthor;
	title: string;
	slug: string;
	body: string;
	status: string;
	isPublished: boolean;
	tags: ITag[];
	category: ICategory;
	createdAt: string;
	updatedAt: string;
	imgSrc: string;
	imgCredits: string;
	wordCount: number;
	lastUpdatedBy: string;
}

export { IUser, ICategory, ITag, IPost };
