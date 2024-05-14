/**
 * Gets the error message or data from axios error object, when an axios
 * call fails due to a server-side error, such as validation
 *
 * @param {object} err Error object thrown by axios when request fails
 * @param {boolean} isDetailed If true, we get the 'details' property, which should be
 *  a map with keys being the fields that were invalid, and the values being the message
 *  indicating why that field is invalid.
 */
export default function getErrorData(err) {
	return err.response.data?.message || "Had trouble getting error message!";
}
