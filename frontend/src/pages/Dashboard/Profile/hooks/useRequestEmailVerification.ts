import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import useToast from "../../../../hooks/useToast";
import getErrorData from "../../../../utils/getErrorData";

/**
 * Hook for verifying the user's current email
 */
export default function useRequestEmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const axiosPrivate = useAxiosPrivate();

  /**
   * Requests the server to send an email verification link to the user's current email
   * @param id - Id of the user we are requesting to verify their current email
   */
  const requestEmailVerification = async (id: string) => {
    const url = `/users/${id}/email/verify`;
    setIsLoading(true);
    try {
      const response = await axiosPrivate.patch(url);

      showToast({
        message: response.data.message,
        severity: "success",
        autoHideDuration: 30000,
      });
    } catch (err: unknown) {
      const errMessage = `Email Verification: ${getErrorData(err as AxiosError)}`;
      showToast({
        message: errMessage,
        severity: "error",
        autoHideDuration: 30000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, requestEmailVerification };
}
