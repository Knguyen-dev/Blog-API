import { TextField, Button, Box } from "@mui/material";
import NewBasicSelect from "../../../../components/select/NewBasicSelect";
import { getRoleNumber } from "../utils/roleUtilities";
import { useState } from "react";
import useAddEmployee from "../hooks/useAddEmployee";
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

const defaultValues = {
	username: "",
	role: getRoleNumber("user"),
};

export default function AddEmployeeForm() {
	const [username, setUsername] = useState(defaultValues.username);
	const [role, setRole] = useState(defaultValues.role);
	const { error, setError, isLoading, addEmployee } = useAddEmployee();

	// But we also need the submit
	const onSubmit = async (e) => {
		e.preventDefault();

		// Ensure both fields are defined before making api call
		if (!username || !role) {
			setError({ message: "All fields must be filled!" });
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
					required
				/>

				<NewBasicSelect
					value={role}
					setValue={setRole}
					label="Role"
					placeholder="Select user's role"
					options={options}
					getOptionLabel={(option) => option.label}
					getOptionValue={(option) => option.value}
				/>

				{error && <div className="error">{error.message}</div>}

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
