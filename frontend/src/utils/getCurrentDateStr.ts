// Returns a string in iSO format utc time of the current date-time
export default function getCurrentDateStr(): string {
  const currentDate = new Date();
  const utcDate = currentDate.toUTCString();
  return utcDate;
}
