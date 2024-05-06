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
	let error = {};

	// Now in this case it wasn't an 429 on the server side, so we should get an error
	// customized by the server
	error.status = err.response.status;
	error.message =
		err.response.data?.error?.message || "Had trouble getting error message!";

	return error;
}
