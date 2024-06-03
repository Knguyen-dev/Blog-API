import { useState } from "react";
import { axiosPublic } from "../../../api/axios";
import { AxiosError } from "axios";
import handleRequestError from "../../../utils/handleRequestError";

import { ISignupFormData } from "../../../types/Auth";
const endpoint = "/auth/signup";

export default function useSignup() {
  /*
  - NOTE: Of course you could simply return 'data' and if !success you can
    overwrite the form errors there, but I found it a little cleaner to have 
    it in a state and use an effect to render out server-side validation errors. 
    It allows us to just return 'success' form our signup hook, and it kept error 
    handling in our useSignup hook.
  */
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
