import { useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useEmployeeContext from "./useEmployeeContext";
import { employeeActions } from "../data/employeeConstants";
import useToast from "../../../../hooks/useToast";
import handleRequestError from "../../../../utils/handleRequestError";

const endpoint = "/employees/add";

interface IAddEmployeeFormData {
	username: string;
	role: string;
}

export default function useAddEmployee() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { dispatch } = useEmployeeContext();
	const { showToast } = useToast();

	const addEmployee = async (formData: IAddEmployeeFormData) => {
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
		} catch (err: any) {
			handleRequestError(err, setError);
		} finally {
			setIsLoading(false);
		}

		return success;
	};

	return { error, setError, isLoading, addEmployee };
}
