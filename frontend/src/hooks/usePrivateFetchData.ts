import useAxiosPrivate from "./useAxiosPrivate";
import { useState, useEffect, useCallback } from "react";
import handleRequestError from "../utils/handleRequestError";
import { AxiosError } from "axios";
/*
- usePrivateFetchData: Fetches data for routes where user authentication is needed.
*/
export default function usePrivateFetchData<T>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchData = useCallback(
    async (url: string, config = {}) => {
      try {
        const response = await axiosPrivate(url, config);
        setError(null);
        setData(response.data);
      } catch (err: unknown) {
        // If it's a canceled error, just stop execution early rather than setting a real error message
        if ((err as AxiosError).code === "ERR_CANCELED") {
          return;
        }

        handleRequestError(err as AxiosError, setError);
      }
      setIsLoading(false);
    },
    [axiosPrivate]
  );

  // Effect loads in the posts in the database
  useEffect(() => {
    const abortController = new AbortController();
    fetchData(url, {
      signal: abortController.signal,
    });
    return () => abortController.abort();
  }, [url, fetchData]);

  return { isLoading, setIsLoading, data, setData, error, setError, fetchData };
}
