import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import useSubmitDisabled from "../user/useSubmitDisabled";
import useEmployeeContext from "./useEmployeeContext";
import employeeActions from "../../constants/employeeActions";
import useToast from "../useToast";

// router.patch("/add", employeeController.addEmployee);

const endpoint = "/employees/add";

export default function useAddEmployee() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { dispatch } = useEmployeeContext();
	const { showToast } = useToast();

	const { submitDisabled, setSubmitDisabled } = useSubmitDisabled(30000);

	const addEmployee = async (formData) => {
		setIsLoading(true);
		setError(null);

		// Boolean indicating if request was successful or not.
		let success = false;
		try {
			// Api call to add employee
			const response = await axiosPrivate.patch(endpoint, formData);

			success = true;

			// Successful, so add employee to our employee state
			dispatch({
				type: employeeActions.ADD_EMPLOYEE,
				payload: response.data, // response.data is the user
			});

			// Use global toast to show that employee has been successfully added
			showToast({
				message: `User ${response.data.username} has been added as an employee!`,
				severity: "success",
			});
		} catch (err) {
			if (err.response) {
				if (err.response.status === 429 && !submitDisabled) {
					setSubmitDisabled(true);
				}
				setError(err.response.data.message);
			} else if (err.request) {
				setError("Network error!");
			} else {
				setError("Something unexpected happened");
			}
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return { error, setError, isLoading, submitDisabled, addEmployee };
}
