import { useState } from "react";
import { AxiosError } from "axios";
import { IResetPasswordFormData } from "../../../types/Auth";
import handleRequestError from "../../../utils/handleRequestError";
import { axiosPublic } from "../../../api/axios";

export default function useResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (
    passwordResetToken: string,
    formData: IResetPasswordFormData
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const endpoint = `/auth/resetPassword/${passwordResetToken}`;
    let success = true;

    try {
      await axiosPublic.post(endpoint, formData);
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
      success = false;
    } finally {
      setIsLoading(false);
    }

    return success;
  };

  return { error, isLoading, resetPassword };
}
