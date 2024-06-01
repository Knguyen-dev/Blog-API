import { getRoleNumber } from "../utils/roleUtilities";
const roleSelectOptions = [
	{
		label: "Editor",
		value: getRoleNumber("editor"),
	},
	{
		label: "Admin",
		value: getRoleNumber("admin"),
	},
];

const employeeActions = {
	ADD_EMPLOYEE: "ADD_EMPLOYEE",
	DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
	UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
	SET_EMPLOYEES: "SET_EMPLOYEES",
};

export {
    roleSelectOptions,
    employeeActions
}