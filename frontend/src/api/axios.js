import axios from "axios";

const BASE_URL = "http://localhost:3000";

export default axios.create({
	baseURL: BASE_URL,
	Accept: "application/json", // indicates that we prefer json data in the response
	headers: {
		"Content-Type": "application/json",
	},
});

export const axiosPrivate = axios.create({
	withCredentials: true, // allow cookies to be sent and set
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json", // By default we're sending json
	},
});
