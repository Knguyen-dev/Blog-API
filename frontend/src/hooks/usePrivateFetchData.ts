import useAxiosPrivate from "./useAxiosPrivate";
import { useState, useEffect } from "react";
import handleRequestError from "../utils/handleRequestError";

/*
- usePrivateFetchData: Fetches data for routes where user authentication is needed.
*/
export default function usePrivateFetchData<T>(url: string) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const axiosPrivate = useAxiosPrivate();

	// Effect loads in the posts in the database
	useEffect(() => {
		const abortController = new AbortController();
		fetchData(url, {
			signal: abortController.signal,
		});
		return () => abortController.abort();
	}, [url, axiosPrivate]);

	const fetchData = async (url: string, config = {}) => {
		try {
			const response = await axiosPrivate(url, config);
			setError(null);
			setData(response.data);
		} catch (err: any) {
			// If it's a canceled error, just stop execution early rather than setting a real error message
			if (err.code === "ERR_CANCELED") {
				return;
			}
			handleRequestError(err, setError);
		}
		setIsLoading(false);
	};

	return { isLoading, setIsLoading, data, setData, error, setError, fetchData };
}
