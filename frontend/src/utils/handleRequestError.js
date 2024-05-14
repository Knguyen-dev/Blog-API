import getErrorData from "./getErrorData";
/*- Could be a server-side validation error, some other server-side error, 
  or a network error we'll. For the first two, we can set the error message
  with the json data, but for the third we can default a hard-coded error message.

1. If err.response exists, the server respodned with a status code that falls out 
  of range 2xx. 
2. If err.request, then the request was made but no response was received.
3. Else, something happened in setting up the request that triggered an error.
  Here it's probably a code error in the front end code.

+ Credit: https://axios-http.com/docs/handling_errors
*/

/**
 * @param {object} err - Error object thrown by a catch block
 * @param {function} setError - Function to set the state of an error
 */
export default function handleRequestError(err, setError) {
	if (err.response) {
		setError(getErrorData(err));
	} else if (err.request) {
		setError("Network Error!");
	} else {
		setError("Something unexpected happened!");
	}
}
