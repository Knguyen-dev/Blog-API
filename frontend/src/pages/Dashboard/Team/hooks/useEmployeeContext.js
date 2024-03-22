import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeProvider";

export default function useEmployeeContext() {
	const context = useContext(EmployeeContext);
	if (!context) {
		throw Error("EmployeeContext must be used inside an EmployeeProvider!");
	}
	return context;
}
