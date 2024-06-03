import { AxiosError } from "axios";
import { useState } from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useLogout from "../../../../hooks/useLogout";
import handleRequestError from "../../../../utils/handleRequestError";
import { IChangePasswordFormData } from "../../../../types/Auth";

export default function useChangePassword() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuthContext();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();

  if (!auth.user) {
    throw new Error(
      "useChangePassword hook was called, but 'auth.user' wasn't defined!"
    );
  }

  const endpoint = `/users/${auth.user._id}/password`;

  const changePassword = async (formData: IChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);
    let success = false;

    try {
      // Make a patch request to change the password of the user
      await axiosPrivate.patch(endpoint, formData);

      success = true;

      // First request was successful, run function to log out the user.
      await logout();

      // On success, we will reset the auth state with our useLogout Hook
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    // Return the success state, and the data
    return success;
  };

  return { error, isLoading, changePassword };
}
