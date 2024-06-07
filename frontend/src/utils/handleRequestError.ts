import getErrorData from "./getErrorData";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

/*- Could be a server-side validation error, some other server-side error, 
  or a network error we'll. For the first two, we can set the error message
  with the json data, but for the third we can default a hard-coded error message.
*/
export default function handleRequestError(
  err: AxiosError,
  setError: Dispatch<SetStateAction<string | null>>
) {
  setError(getErrorData(err));
}
