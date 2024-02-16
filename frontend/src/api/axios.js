import axios from "axios";

const BASE_URL = "http://localhost:3000";

export default axios.create({
	baseURL: BASE_URL,
	Accept: "application/json", // indicates that we prefer json data in the response
});

export const axiosPrivate = axios.create({
	withCredentials: true, // allow cookies to be sent and set
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json", // indicatse that we are sending json
	},
});
