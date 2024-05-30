export default function getCurrentDateStr(): string {
	const currentDate = new Date();

	const utcDate = currentDate.toUTCString();

	return utcDate;
}
