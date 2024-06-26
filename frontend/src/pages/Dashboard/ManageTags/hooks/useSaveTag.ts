import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";
import { AxiosError } from "axios";
import { ITagFormData } from "../../../../types/Post";

export default function useSaveTag() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  // Helper function for making PATCH request for existing category
  const saveExistingTag = async (tag: ITagFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosPrivate.patch(`/tags/${tag._id}`, tag);
      return response.data; // Return the updated category data
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for making POST request for a new category
  const createNewTag = async (tagData: ITagFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosPrivate.post("/tags", tagData);
      return response.data; // Return the newly created category data
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    setError,
    isLoading,
    saveExistingTag,
    createNewTag,
  };
}
