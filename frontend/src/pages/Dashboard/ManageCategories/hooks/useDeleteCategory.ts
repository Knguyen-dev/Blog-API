import { useState } from "react";
import { AxiosError } from "axios";
import handleRequestError from "../../../../utils/handleRequestError";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function useDeleteCategory() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const deleteCategory = async (categoryID: string) => {
    setIsLoading(true);
    setError(null);
    let success = false;
    try {
      await axiosPrivate.delete(`/categories/${categoryID}`);
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
    deleteCategory,
  };
}
