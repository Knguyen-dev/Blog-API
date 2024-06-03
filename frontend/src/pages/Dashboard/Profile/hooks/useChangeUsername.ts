import { AxiosError } from "axios";
import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import authActions from "../../../../constants/authActions";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import handleRequestError from "../../../../utils/handleRequestError";
import { IChangeUsernameFormData } from "../../../../types/Auth";

export default function useChangeUsername() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth, dispatch } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  if (!auth.user) {
    throw new Error(
      "useChangeFullName hook was called, but 'auth.user' wasn't defined!"
    );
  }
  const endpoint = `/users/${auth.user._id}/username`;

  const changeUsername = async (formData: IChangeUsernameFormData) => {
    setIsLoading(true);
    setError(null);
    let success = false;

    try {
      const response = await axiosPrivate.patch(endpoint, formData);

      // At this point we have a successful username change
      success = true;

      // On success, API should send back the updated user object
      dispatch({ type: authActions.updateUser, payload: response.data });
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    return success;
  };

  return { error, isLoading, changeUsername };
}
