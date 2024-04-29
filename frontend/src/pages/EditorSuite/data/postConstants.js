// Actions for the postReducer
const postActions = {
	SET_TITLE: "SET_TITLE",
	SET_BODY: "SET_BODY",
	SET_CATEGORY: "SET_CATEGORY",
	SET_TAGS: "SET_TAGS",
	SET_IMAGE: "SET_IMAGE",
	SET_IMAGE_CREDITS: "SET_IMAGE_CREDITS",
	SET_STATUS: "SET_STATUS",
	SET_POST: "SET_POST",
	CLEAR_POST: "CLEAR_POST",
};

// The various 'status' a post can be in.
const postStatuses = [
	{
		label: "Draft",
		value: "draft",
	},
	{
		label: "Published",
		value: "published",
	},
	{
		label: "Private",
		value: "private",
	},
];

/*
- Minimum word count for a post.
- NOTE: This value should match whatever we have on our backend.
*/
const minWordCount = 150;

export { minWordCount, postActions, postStatuses };
