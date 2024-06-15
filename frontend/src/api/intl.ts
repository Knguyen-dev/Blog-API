// Options to format a blog post's date
const options: Intl.DateTimeFormatOptions = {
  year: "numeric", // 2024
  month: "short", // 'Mar' instead of 'March'
  day: "2-digit", // '03' instead of '3'
};

/**
 * Given a date string, return a formatted date string for a blog post
 * @param isoDateString - An ISO date string
 */
const formatBlogPostDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};

export { formatBlogPostDate };
