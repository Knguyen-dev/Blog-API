import useToast from "../../hooks/useToast";
import { TextField, Button, Box } from "@mui/material";
import BasicSelect from "../Input/BasicSelect";
import { getRoleNumber } from "../../utilities/roleUtilities";
import { useState } from "react";
import useAddEmployee from "../../hooks/employee/useAddEmployee";
const options = [
	{
		label: "User",
		value: getRoleNumber("user"),
	},
	{
		label: "Editor",
		value: getRoleNumber("editor"),
	},
	{
		label: "Admin",
		value: getRoleNumber("admin"),
	},
];

/*
- Okay so after we add an employee we want to update the internal state of 
  the data grid as well. The issue is that well they are two separated components.
  I think an appropriate idea here would be a context provider. Or a shared
  state between useAddEmployee hook, and then our EmployeeGrid

- NOTE: For select component make sure you define a valid default value 
  to prevent the error "Mui component switching from uncontrolled to controlled 
  or vice versa.". Or you could define a placeholder with value 'null' so that 
  you can set our state, role, to null.

*/

const defaultValues = {
	username: "",
	role: getRoleNumber("user"),
};

export default function AddEmployeeForm() {
	const [username, setUsername] = useState(defaultValues.username);
	const [role, setRole] = useState(defaultValues.role);
	const { error, setError, isLoading, submitDisabled, addEmployee } =
		useAddEmployee();

	// But we also need the submit
	const onSubmit = async (e) => {
		e.preventDefault();

		// Ensure both fields are defined before making api call
		if (!username || !role) {
			setError("All fields must be filled!");
			return;
		}

		// Api call to add employee
		const success = await addEmployee({ username, role });

		// If success,
		if (success) {
			setUsername(defaultValues.username);
			setRole(defaultValues.role);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
				<TextField
					id="username"
					name="username"
					label="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<BasicSelect
					value={role}
					setValue={setRole}
					label="Role"
					options={options}
					placeholder="Select Role"
				/>

				{error && <div className="error">{error}</div>}

				<Button
					type="submit"
					disabled={isLoading || submitDisabled}
					sx={{ alignSelf: "end" }}
					variant="contained">
					Submit
				</Button>
			</Box>
		</form>
	);
}
