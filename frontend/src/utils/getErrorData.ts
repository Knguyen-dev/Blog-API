import { AxiosError } from "axios";

interface IErrorDetail {
	field: string;
	message: string;
}

interface IErrorData {
	message: string;
	statusCode: number;
	details?: IErrorDetail[];
}

/**
 * Gets the error message or data from axios error object, when an axios
 * call fails due to a server-side error, such as validation
 *
 * @param {object} err Error object thrown by axios when request fails
 */
export default function getErrorData(err: AxiosError) {
	const errData = err.response?.data as IErrorData; // Assume err.response is defined, so we got a response from the server
	return errData.message || "Had trouble getting error message!";
}
