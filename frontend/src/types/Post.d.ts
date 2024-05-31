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
	type: "IPost"
}

type PostStatusType = "draft" | "published" | "private";

// Defines the properties of the object that's needed to be passed to the backend when creating a post
interface IPostData {
	title: string;
	body: string;
	wordCount: number;
	category: string | null; // category ID
	tags: ITag[]; 
	imgSrc: string;
	imgCredits: string;
	status: PostStatusType;
	type: "IPostData"
}

export { IUser, ICategory, ITag, IPost, IPostData, PostStatusType};
