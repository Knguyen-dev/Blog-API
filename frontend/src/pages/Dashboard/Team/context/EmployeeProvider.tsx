/*
+ EmployeeProvider: Provider used for storing state data about the employee grid.
*/
import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { employeeActions } from "../data/employeeConstants";
import { IUser } from "../../../../types/Post";

interface IEmployeeState {
	employees: IUser[];
}

interface EmployeeAction {
	type: string;
	payload?: any;
}

interface IEmployeeContext {
	state: IEmployeeState;
	dispatch: Dispatch<EmployeeAction>
}

interface IEmployeeProviderProps {
	children: ReactNode;
}

const EmployeeContext = createContext<IEmployeeContext | undefined>(undefined);

const employeeReducer = (state: IEmployeeState, action: EmployeeAction) => {
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

const EmployeeProvider = ({ children }: IEmployeeProviderProps) => {

	const [state, dispatch] = useReducer(employeeReducer, {
		employees: [],
	});




	return (
		<EmployeeContext.Provider value={{ state, dispatch }}>
			{children}
		</EmployeeContext.Provider>
	);
};

export { EmployeeContext, EmployeeProvider };
