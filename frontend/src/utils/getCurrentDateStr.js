export default function getCurrentDateStr() {
	const currentDate = new Date();

	const utcDate = currentDate.toUTCString();

	return utcDate;
}
