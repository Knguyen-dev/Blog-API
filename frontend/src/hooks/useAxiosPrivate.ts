import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuthContext from "./useAuthContext";

/*
+ useAxiosPrivate: A hook that will return our axiosPrivate instance
  with appropriate request and response interceptors. We'll achieve
  this using an effect, so after the component using this hook mounts,
  the axiosPrivate instance that we returned will have those 
  interceptors, which will make it ready for essentially immediate use.
  
- NOTE: 
  1. Adding the interceptors inside a component body could lead to 
  inconsistent behavior, allowing duplicate interceptors, while 
  putting it inside an effect gives us an easy way to control the 
  modification of our axiosPrivate instance. 

  2. When working with Axios, it seems that when we retry requests with 
  FormData object, that object won't be available in the next request.
  It's annoying, but a safe way to get around this is to ensure that 
  the access token is valid before we make the request.
*/

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuthContext();

  useEffect(() => {
    // Create 'interceptor' that ensures the request has an 'Authorization' header with an access token for we send the request.
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (request) => {
        if (!request.headers["Authorization"]) {
          request.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return request;
      },
      (err) => {
        Promise.reject(err);
      }
    );

    // Create a response interceptor that re-tries the fetch request under certain circumstances.
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err) => {
        // get the previous request that was made
        const prevRequest = err?.config;

        /*
        - If we were sending FormData object, it's probably a multipart/form-data. 
          However, for some the reason the content type is not maintained for 'multipart/form-data'.

        - NOTE: If you don't do this, then on the retry you'll experience an error as 
          your request won't contain the FormData object with that file you sent.
        */
        if (prevRequest.data instanceof FormData) {
          prevRequest.headers["Content-Type"] = "multipart/form-data";
        }

        /*
        - If we got a 401 (access token invalid) or .sent property isn't true (haven't retried the request)
        1. Indicate that we're retrying the request.
        2. Try to get new access token.
        3. Update the authorization header on our old reequest to have a new access token
        4. Execute our new axiosPrivate request, essentially retrying our original request

        - NOTE: After this, we run the responseIntercept, we see that our authorization
          header is already defined so nothing is done there. If we fail our request a 
          second time, we see that we've already retried our request so we don't retry
          it again. This prevents us from getting stuck in an infinite loop of 
          getting a new refresh token and retrying.
        */
        if (err?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        /*
        - Means that in our axiosPrivate request, we weren't rejected due to a bad access token
          or our request was already retried (.sent === true). If this was true then just return
          an error as a promise, which we'll plan to catch. Typically if we fail to refresh our 
          access token, that means our refresh token has expired, so at this point you'd need to 
          prompt the user to re-authenticate and re-enter their credentials.

        */
        return Promise.reject(err);
      }
    );

    /*
    - We'll need to remove the interceptors after we run the effect.
      This is so that when component unmounts, we'll remove the original
      interceptors. This prevents us from having multiple duplicate
      interceptors!
    */
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}
