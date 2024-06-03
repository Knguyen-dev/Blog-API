import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";
import { AxiosError } from "axios";
export default function useDeleteTag() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const deleteTag = async (tagID: string) => {
    setIsLoading(true);
    setError(null);
    let success = false;
    try {
      await axiosPrivate.delete(`/tags/${tagID}`);
      success = true;
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }
    return success;
  };

  return {
    error,
    isLoading,
    deleteTag,
  };
}
