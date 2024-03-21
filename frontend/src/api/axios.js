import axios from "axios";

const BASE_URL = "http://localhost:3000";

/**
 * Axios instance for making public API requests. So these requests won't
 * have an authorization header, nor will they have credentials/cookies.
 *
 * @type {import("axios").AxiosInstance}
 */
export default axios.create({
	baseURL: BASE_URL,
	Accept: "application/json", // indicates that we prefer json data in the response
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Axios instance for making private API requests. These requests will
 * have cookies/credentials, and we plan for them to have an authorization
 * header.
 *
 * @type {import("axios").AxiosInstance}
 */
export const axiosPrivate = axios.create({
	withCredentials: true, // allow cookies to be sent and set
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json", // By default we're sending json
	},
});
