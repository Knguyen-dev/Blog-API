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

type PostStatusType = "draft" | "published" | "private";

interface IPostState {
	title: string;
	body: string;
	wordCount: number;
	category?: ICategory;
	tags: ITag[];
	imgSrc: string;
	imgCredits: string;
	status: PostStatusType;
	authorName: string; // Name of the author who owns the post; they wrote or is writing the post
	createdAt: string; // iso date string; should be defined when creating a new post and editing an existing one

	// Id of the post; in cases where we're editing an existing post
	_id?: string;
}

interface IPostData {
	title: string;
	category?: ICategory;
	body: string;
	wordCount: number;
	tags: ITag[];
	imgSrc: string;
	imgCredits: string;
	status: PostStatusType;
}

interface IPost extends IPostData {
	_id: string;
	user: IUser;
	slug: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
	lastUpdatedBy: string;
}

// Defines the properties of the state managed by the CreatePostPage and EditPostPage
interface IPostData {
	title: string;
	body: string;
	wordCount: number;
	/*
  - 'category' can be null which is the idea of 'clearing' the category. But remember
  that in the end, all posts must have categories before they're submitted to be saved.
  */
	category?: ICategory;
	tags: ITag[];
	imgSrc: string;
	imgCredits: string;
	status: PostStatusType;
}

// Interface for the object you need to pass to the backend for creating a new post
interface IAPIPostData {
	title: string;
	body: string;
	wordCount: number;
	category: string; // category ID
	tags: string[]; // array of tag IDs
	imgSrc: string;
	imgCredits: string;
	status: PostStatusType;

	// Property of the post; exists when we are editing an existing post
	_id?: string;
}

export {
	IUser,
	ICategory,
	ITag,
	IPost,
	IPostData,
	PostStatusType,
	IAPIPostData,
	IPostState,
};
