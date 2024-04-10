const formatBlogPostDate = (isoDateString) => {
	const date = new Date(isoDateString);
	const options = {
		year: "numeric", // 2024
		month: "short", // 'Mar' instead of 'March'
		day: "2-digit", // '03' instead of '3'
	};
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
	return formattedDate;
};

export { formatBlogPostDate };
