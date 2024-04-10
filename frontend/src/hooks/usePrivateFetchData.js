import useAxiosPrivate from "./useAxiosPrivate";
import { useState, useEffect } from "react";
import getErrorData from "../utils/getErrorData";
export default function usePrivateFetchData(url) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	/*
  - NOTE: Now this should probably be called usePrivateFetchData because
    it only fetches the data when the user is logged in. So just note that. 
  
  - Though, now I think we could use this effect a couple of times!
  
  */

	// Effect loads in the posts in the database
	useEffect(() => {
		const abortController = new AbortController();
		const getData = async () => {
			try {
				const response = await axiosPrivate(url, {
					signal: abortController.signal,
				});
				setData(response.data);
			} catch (err) {
				// If it's a canceled error, just stop execution early
				if (err.code === "ERR_CANCELED") {
					return;
				}
				if (err.response) {
					setError(getErrorData(err, false));
				} else if (err.request) {
					setError("Network error!");
				} else {
					setError("Something unexpected happened!");
				}
				console.error(err);
			}
			setIsLoading(false);
		};

		getData();
		return () => abortController.abort();
	}, [url, axiosPrivate]);

	return { isLoading, data, setData, error };
}
