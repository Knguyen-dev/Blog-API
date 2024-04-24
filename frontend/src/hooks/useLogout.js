import axios from "../api/axios";
import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router-dom";

import authActions from "../constants/authActions";
const endpoint = "/auth/logout";

export default function useLogout() {
	const { dispatch } = useAuthContext();
	const navigate = useNavigate();

	/*
  + Wipes global auth state (front-end), and makes call to wipe refresh token cookie (backend).

  - NOTE: Since there are no try/catch blocks here, the error will be propagated up
    to the nearest try/catch. This is especially convenient in useChangePassword as 
    our changePassword has a single try/catch that covers multiple requests.
  */
	const logout = async () => {
		await axios(endpoint, {
			withCredentials: true,
		});
		dispatch({ type: authActions.logout });

		/*
    - Clear the 'postData' which is the post data from the unsaved
      post that the user was creating

    NOTE: This prevents the 'postData' from transferring when a user on the same 
    computer AND they log out from one account and login to another account.
    */
		localStorage.removeItem("postData");

		/*
    - Manually redirect the user to the login page.
    
    NOTE: Redirect the user to the login page, rather than let ProtectedRoute redirect them. 
      Assume we let ProtectedRoute do the redirecting:
    1. Login as admin. Go to a protected route such as "/dashboard/manage-posts".
      Now you logout.
    
    2. Now ProtectedRoute redirects to login page but 
      it records the route they were redirected from ('/dashboard/manage-posts'). 
    
    3. Login with an account that has role 'user'. Logging in will redirect us
    to location.state.from ('/dashboard/manage-posts' created by ProtectedRoute) 

    4. Since user doesn't have access to this route, we're actually redirected to 
      the NotAuthorized page. Switching from ADMIN account to a USER account 
      shouldn't do this, so we need a solution.

    SOLUTION: Manually redirect the user to the login page so that ProtectedRoute doesn't have the 
    chance to record a 'location.state.from' value. 
    */
		navigate("/auth/login");
	};

	return logout;
}
