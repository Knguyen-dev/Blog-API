import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useEmployeeContext from "./useEmployeeContext";
import employeeActions from "../data/employeeActions";
import useToast from "../../../../hooks/useToast";
import handleRequestError from "../../../../utils/handleRequestError";

/*
- Custom hook for removing employees. 
- NOTE: When we're talking about removing employees, we mean modifying 
  users to indicate that they aren't employees anymore. To make things clear 
  'employees' are just user documents that have 'isEmployee' marked as true.
  We aren't deleting these users, just making 'isEmployee' false for them.
*/

export default function useRemoveEmployee() {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { dispatch } = useEmployeeContext();
	const { showToast } = useToast();

	const removeEmployee = async (id) => {
		setIsLoading(true);
		setError(null);

		const endpoint = `/employees/remove/${id}`;

		// Boolean indicating if request was successful or not.
		let success = false;

		try {
			// Api call to delete employee
			await axiosPrivate.delete(endpoint);

			success = true;

			// Successful, so remove that deleted employee from our employee state.
			dispatch({
				type: employeeActions.DELETE_EMPLOYEE,
				payload: id, // Send the user id so that user can be removed from state
			});

			// Show success message on global toast that we have
			showToast({
				message: `User successfully removed as an employee!`,
				severity: "success",
			});
		} catch (err) {
			// Record the error state to show on the dialog.
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return { error, isLoading, removeEmployee };
}
