import { AxiosError } from "axios";
import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";
import { IChangeEmailFormData } from "../../../../types/Auth";

export default function useChangeEmail() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuthContext();

  if (!auth.user) {
    throw new Error(
      "useChangeEmail hook was called, but 'auth.user' wasn't defined!"
    );
  }

  const endpoint = `/users/${auth.user._id}/email`;
  const axiosPrivate = useAxiosPrivate();

  const changeEmail = async (formData: IChangeEmailFormData) => {
    setIsLoading(true);
    setError(null);
    let successMessage: string | undefined = undefined;

    try {
      const response = await axiosPrivate.patch(endpoint, formData);
      successMessage = response.data.message;
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    // Return the success message
    return successMessage;
  };

  return { error, setError, isLoading, changeEmail };
}
