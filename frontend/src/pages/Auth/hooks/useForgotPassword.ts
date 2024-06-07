import { axiosPublic } from "../../../api/axios";
import { useState } from "react";
import handleRequestError from "../../../utils/handleRequestError";
import { AxiosError } from "axios";
import { IForgotPasswordFormData } from "../../../types/Auth";

const endpoint = "/auth/forgotPassword";

export default function useForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPasswordResetLink = async (
    formData: IForgotPasswordFormData
  ): Promise<string | null> => {
    setError(null);
    setIsLoading(true);

    let successMessage = null;

    try {
      const response = await axiosPublic.post(endpoint, formData);

      // Get the data (our success message from the server)
      successMessage = response.data.message;
    } catch (err) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    // Return a success message or null
    return successMessage;
  };

  return { error, isLoading, requestPasswordResetLink };
}
