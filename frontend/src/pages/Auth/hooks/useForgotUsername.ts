import { axiosPublic } from "../../../api/axios";
import { useState } from "react";
import handleRequestError from "../../../utils/handleRequestError";
import { AxiosError } from "axios";
import { IForgotUsernameFormData } from "../../../types/Auth";

const endpoint = "/auth/forgotUsername";

export default function useForgotUsername() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Makes a call to the server to send the user an email with their username
  const requestUsername = async (formData: IForgotUsernameFormData) => {
    setError(null);
    setIsLoading(true);
    let successMessage = null;
    try {
      const response = await axiosPublic.post(endpoint, formData);
      successMessage = response.data.message;
    } catch (err) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    return successMessage;
  };

  return { error, isLoading, requestUsername };
}
