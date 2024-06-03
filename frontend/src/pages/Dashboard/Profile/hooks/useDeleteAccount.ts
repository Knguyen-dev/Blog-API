import { AxiosError } from "axios";
import useLogout from "../../../../hooks/useLogout";
import useAuthContext from "../../../../hooks/useAuthContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useState } from "react";
import handleRequestError from "../../../../utils/handleRequestError";
import { IDeleteAccountFormData } from "../../../../types/Auth";

export default function useDeleteAccount() {
  const logout = useLogout();
  const { auth } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!auth.user) {
    throw new Error(
      "useDeleteAccount hook was called, but 'auth.user' wasn't defined!"
    );
  }

  const endpoint = `/users/${auth.user._id}`;

  const deleteAccount = async (formData: IDeleteAccountFormData) => {
    setIsLoading(true);
    setError(null);
    let success = false;

    try {
      // Do a delete request on the user on the backend.
      await axiosPrivate.delete(endpoint, {
        data: formData,
      });

      // If successful, mark it as so, and get the object containing the success message
      // sent by our server.
      success = true;

      // Then clear/logout the user for front-end/back-end
      await logout();
    } catch (err: unknown) {
      handleRequestError(err as AxiosError, setError);
    } finally {
      setIsLoading(false);
    }

    return success;
  };

  return { error, isLoading, deleteAccount };
}
