const options: Intl.DateTimeFormatOptions = {
	year: "numeric", // 2024
	month: "short", // 'Mar' instead of 'March'
	day: "2-digit", // '03' instead of '3'
};

const formatBlogPostDate = (isoDateString: string): string => {
	const date = new Date(isoDateString);
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
	return formattedDate;
};

const formatBlogDate = (dateObj: Date) => {
	const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
		dateObj
	);
	return formattedDate;
};

export { formatBlogPostDate, formatBlogDate };
