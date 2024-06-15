import { useState } from "react";
import { axiosPublic } from "../../../api/axios";
import { AxiosError } from "axios";
import handleRequestError from "../../../utils/handleRequestError";
import { ISignupFormData } from "../../../types/Auth";
const endpoint = "/auth/signup";

/**
 * Custom hook for handling the user signup request and process
 */
export default function useSignup() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const signup = async (formData: ISignupFormData) => {
    setIsLoading(true);
    setError(null);
    let success = false;
    try {
      await axiosPublic.post(endpoint, formData);
      success = true;
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      // Regardless, indicate we aren't loading anymore
      setIsLoading(false);
    }

    // Return success state and data
    return success;
  };

  return { error, isLoading, signup };
}
