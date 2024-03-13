/*
+ EmployeeProvider: Provider used for storing state data about the employee grid.
*/
import { createContext, useReducer } from "react";
import employeeActions from "../constants/employeeActions";
import PropTypes from "prop-types";

const EmployeeContext = createContext();

const employeeReducer = (state, action) => {
	switch (action.type) {
		case employeeActions.ADD_EMPLOYEE: // assumes payload is new user object
			return {
				...state,
				employees: [...state.employees, action.payload],
			};
		case employeeActions.DELETE_EMPLOYEE: // assumes payload is id of employee to be deleted
			return {
				...state,
				employees: state.employees.filter(
					(employee) => employee._id !== action.payload
				),
			};
		// assumes payload is the user object representing the employee to be updated
		case employeeActions.UPDATE_EMPLOYEE:
			return {
				...state,
				employees: state.employees.map((employee) =>
					employee._id === action.payload._id ? action.payload : employee
				),
			};

		// Assumes payload is array of employees
		case employeeActions.SET_EMPLOYEES:
			return {
				...state,
				employees: action.payload,
			};
		default:
			return state;
	}
};

const EmployeeProvider = ({ children }) => {
	const [state, dispatch] = useReducer(employeeReducer, {
		employees: [],
	});

	return (
		<EmployeeContext.Provider value={{ state, dispatch }}>
			{children}
		</EmployeeContext.Provider>
	);
};

EmployeeProvider.propTypes = {
	children: PropTypes.element,
};

export { EmployeeContext, EmployeeProvider };
