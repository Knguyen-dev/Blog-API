const options = {
	year: "numeric", // 2024
	month: "short", // 'Mar' instead of 'March'
	day: "2-digit", // '03' instead of '3'
};

const formatBlogPostDate = (isoDateString) => {
	const date = new Date(isoDateString);
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
	return formattedDate;
};

const formatBlogDate = (dateObj) => {
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
		dateObj
	);
	return formattedDate;
};

export { formatBlogPostDate, formatBlogDate };
