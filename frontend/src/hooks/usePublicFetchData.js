/*
Custom hook for fetching data from our backend, that doesn't require the user to login (a jwt).



*/
import axios from "../api/axios";
import getErrorData from "../utils/getErrorData";
import { useState, useEffect } from "react";

export default function usePublicFetchData(url) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	/*
  + Effect: Does a fetch request to the specified URL when the component using 
    this custom hook mounts.
  */
	useEffect(() => {
		const abortController = new AbortController();
		fetchData(url, {
			signal: abortController.signal,
		});

		return () => abortController.abort();
	}, [url]);

	/**
	 * Handles launching a fetch request to our express api backend
	 */
	const fetchData = async (url, config = {}) => {
		try {
			const response = await axios(url, config);
			setData(response.data);
		} catch (err) {
			// If it's a canceled error, just stop execution early
			if (err.code === "ERR_CANCELED") {
				return;
			}

			if (err.response) {
				setError(getErrorData(err, true));
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened!");
			}
			console.error(err);
		}
		setIsLoading(false);
	};

	return { isLoading, setIsLoading, data, setData, error, setError, fetchData };
}
