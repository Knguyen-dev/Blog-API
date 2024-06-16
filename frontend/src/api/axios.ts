import axios, { AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Axios instance for making public API requests. Requests that don't need
 * any form of jwt or token for the backend.
 */
const axiosPublic: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json", // indicates that we prefer json data in the response
	},
});

/**
 * Axios instance for making private API requests. These requests will
 * have cookies/credentials, and we plan for them to have an authorization header.
 */
const axiosPrivate: AxiosInstance = axios.create({
	withCredentials: true, // allow cookies to be sent and set
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json", // By default we're sending json
	},
});
/**
 * Axios instance for making private API requests. These requests will
 * have cookies/credentials, and we plan for them to have an authorization
 * header.
 *
 * @type {import("axios").AxiosInstance}
 */

export { axiosPublic, axiosPrivate };
