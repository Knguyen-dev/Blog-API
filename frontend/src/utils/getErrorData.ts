import { AxiosError } from "axios";

interface IErrorDetail {
  field: string;
  message: string;
}

interface IErrorData {
  message: string;
  statusCode: number;
  details?: IErrorDetail[];
}

/**
 * Gets the error message or data from axios error object, when an axios
 *
 * 1. If err.response exists, the server respodned with a status code that falls out
 *   of range 2xx.
 * 2. If err.request, then the request was made but no response was received.
 * 3. Else, something happened in setting up the request that triggered an error.
 *   Here it's probably a code error in the front end code.
 * @param {object} err Error object thrown by axios when request fails
 *
 * + Credit: https://axios-http.com/docs/handling_errors
 */
export default function getErrorData(err: AxiosError) {
  let errMessage = "";
  if (err.response) {
    const errData = err.response.data as IErrorData; // Assume err.response is defined, so we got a response from the server
    errMessage = errData.message || "Had trouble getting error message!";
  } else if (err.request) {
    errMessage = "Network Error!";
  } else {
    errMessage = "Something unexpected happened!";
  }

  return errMessage;
}
