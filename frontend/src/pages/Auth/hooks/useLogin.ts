import { useState } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { axiosPrivate } from "../../../api/axios";
import { AxiosError } from "axios";
import authActions from "../../../constants/authActions";
import handleRequestError from "../../../utils/handleRequestError";
import { ILoginFormData } from "../../../types/Auth";

const endpoint = "/auth/login";

// Hook for logging in the current user
export default function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (formData: ILoginFormData) => {
    setIsLoading(true);
    setError(null);
    let success = false;

    try {
      const response = await axiosPrivate.post(endpoint, formData);
      success = true;

      /*
      - Set the auth state to what we got from the endpoint. We should 
      be getting an object with the user's role, and access token.
      */
      dispatch({ type: authActions.login, payload: response.data });
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    return success;
  };

  return { error, setError, isLoading, login };
}
