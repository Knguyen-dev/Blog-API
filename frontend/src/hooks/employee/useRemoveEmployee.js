import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import useSubmitDisabled from "../user/useSubmitDisabled";
import useEmployeeContext from "./useEmployeeContext";
import employeeActions from "../../constants/employeeActions";

/*
- Custom hook for removing employees. 

- NOTE: The reason this custom hook doesn't have an 'error' 'setError' state
  is that we opted to render the error through our global toast rather 
  than on the dialog itself. Just a preference.
*/

export default function useRemoveEmployee() {
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { dispatch } = useEmployeeContext();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled(30000);

	const removeEmployee = async (id) => {
		setIsLoading(true);

		const endpoint = `/employees/remove/${id}`;

		// Boolean indicating if request was successful or not.
		let success = false;
		let error = "";
		try {
			// Api call to delete employee
			const response = await axiosPrivate.patch(endpoint);

			success = true;

			// Successful, so remove that deleted employee from our employee state.
			dispatch({
				type: employeeActions.DELETE_EMPLOYEE,
				payload: response.data._id, // Send the user id so that user can be removed from state
			});
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				error = err.response.data.message || "Server error!";
			} else if (err.request) {
				error = "Network error!";
			} else {
				error = "Something unexpected happened!";
			}
		} finally {
			setIsLoading(false);
		}

		return { success, error };
	};

	return { isLoading, submitDisabled, removeEmployee };
}
