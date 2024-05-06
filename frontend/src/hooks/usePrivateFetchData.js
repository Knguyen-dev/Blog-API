import useAxiosPrivate from "./useAxiosPrivate";
import { useState, useEffect } from "react";
import handleRequestError from "../utils/handleRequestError";

/*
- usePrivateFetchData: Fetches data for routes where user authentication is needed.
*/
export default function usePrivateFetchData(url) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

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
				handleRequestError(err, setError);
				console.error(err);
			}
			setIsLoading(false);
		};

		getData();
		return () => abortController.abort();
	}, [url, axiosPrivate]);

	return { isLoading, data, setData, error };
}
