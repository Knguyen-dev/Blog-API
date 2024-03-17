import useAxiosPrivate from "./useAxiosPrivate";
import { useState, useEffect } from "react";

export default function useGetData(url) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosPrivate.get(url);
				setData(response.data);
			} catch (err) {
				if (err.response) {
					setError(
						err.response?.data?.error?.message || "Server error occurred!"
					);
				} else if (err.request) {
					setError("Network error!");
				} else {
					setError("Something unexpected happened!");
				}
			}
			setIsLoading(false);
		};

		fetchData();
	}, [url, axiosPrivate]);

	return { isLoading, data, error };
}
