import { useState } from "react";
import handleRequestError from "../../../../utils/handleRequestError";
import { AxiosError } from "axios";
import { axiosPublic } from "../../../../api/axios";

export default function useVerifyEmail() {
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles launching a request to verify a user's current email address.
   *
   * NOTE: It should be noted that making a email verification request (asking the link to be sent to you)
   * needs for you to be logged in, however the verification itself does not.
   */
  const verifyEmail = async (verifyEmailToken: string) => {
    try {
      const response = await axiosPublic.post(
        `auth/verifyEmail/${verifyEmailToken}`
      );
      setError(null);
      setData(response.data.message);
    } catch (err: unknown) {
      // If it's a canceled error, just stop execution early
      if ((err as AxiosError).code === "ERR_CANCELED") {
        return;
      }
      handleRequestError(err as AxiosError, setError);
    }
  };

  return { data, error, verifyEmail };
}
