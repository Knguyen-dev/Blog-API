import { TextField, Button, Box, SelectChangeEvent } from "@mui/material";
import NewBasicSelect from "../../../../components/select/NewBasicSelect";
import { getRoleNumber } from "../utils/roleUtilities";
import { FormEvent, useState } from "react";
import useAddEmployee from "../hooks/useAddEmployee";
import { roleSelectOptions } from "../data/employeeConstants";

// Defines our default state values
const defaultValues = {
	username: "",
	role: getRoleNumber("editor"),
};

export default function AddEmployeeForm() {
	const [username, setUsername] = useState(defaultValues.username);
	const [role, setRole] = useState<string | undefined>(defaultValues.role);
	const { error, setError, isLoading, addEmployee } = useAddEmployee();

	const onSubmit = async (e: FormEvent) => {
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

	const onRoleChange = (e: SelectChangeEvent) => {
		setRole(e.target.value);
	}

	return (
		<form onSubmit={onSubmit}>
			<Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
				<TextField
					id="username"
					name="username"
					label="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>

				<NewBasicSelect
					value={role || "Role selected isn't recognized!"}
					onChange={onRoleChange}
					label="Role"
					placeholder="Select user's role"
					options={roleSelectOptions}
					getOptionLabel={(option) => option.label}
					getOptionValue={(option) => option.value}
				/>

				{error && <div className="error">{error}</div>}

				<Button
					type="submit"
					disabled={isLoading}
					sx={{ alignSelf: "end" }}
					variant="contained">
					Submit
				</Button>
			</Box>
		</form>
	);
}
