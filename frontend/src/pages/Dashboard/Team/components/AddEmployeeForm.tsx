import { TextField, Button, Box, SelectChangeEvent } from "@mui/material";
import { FormEvent, useState } from "react";
import useAddEmployee from "../hooks/useAddEmployee";
import { roleSelectOptions } from "../data/employeeConstants";
import NewBasicSelect from "../../../../components/select/NewBasicSelect";
import { roleMap } from "../../../../utils/roleUtils";
import FormError from "../../../../components/Input/FormError";

// Defines our default state values
const defaultValues = {
  username: "",
  role: roleMap.editor,
};

export default function AddEmployeeForm() {
  const [username, setUsername] = useState(defaultValues.username);
  const [role, setRole] = useState<string>(defaultValues.role);
  const { error, setError, isLoading, addEmployee } = useAddEmployee();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Ensure both fields are defined before making api call
    if (!username) {
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
          onChange={onRoleChange}
          label="Role"
          placeholder="Select user's role"
          options={roleSelectOptions}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
        />

        {error && <FormError message={error} />}

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
