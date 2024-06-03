/*
Custom hook for fetching data from our backend, that doesn't require the user to login (a jwt).
*/
import { axiosPublic } from "../api/axios";
import { AxiosError } from "axios";
import handleRequestError from "../utils/handleRequestError";
import { useState, useEffect } from "react";

export default function usePublicFetchData<T>(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<string | null>(null);

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
  const fetchData = async (url: string, config = {}) => {
    try {
      const response = await axiosPublic(url, config);
      setError(null);
      setData(response.data);
    } catch (err: unknown) {
      // If it's a canceled error, just stop execution early
      if ((err as AxiosError).code === "ERR_CANCELED") {
        return;
      }
      handleRequestError(err as AxiosError, setError);
    }
    setIsLoading(false);
  };

  return { isLoading, setIsLoading, data, setData, error, setError, fetchData };
}
