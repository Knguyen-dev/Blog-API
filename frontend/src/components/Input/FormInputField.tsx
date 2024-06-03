/*
+ Using a component library with react-hook-form:
- React Hook form has a 'Controller' component that we can use to work iwth 
  component libraries. The Controller solves the problem of accessing the ref
  of the input. Essentially it looks like this:

<Controller
  control={control}
  name="test"
  render={({
    field: { onChange, onBlur, value, name, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState,
  }) => ( WHATEVER_INPUT_WE_WANT )}
/>

- control: What we get back form the useForm hook and is passed to the input
- name: How react hook form is going to track the value.
- render: Render the component we want to use.

- NOTE: We'll specifically use this when we need our input fields to work 
  with react-hook-form. If you're not going to use react-hook-form for a particular form
  ,then use TextField or some other component instead of this.
*/

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextField, TextFieldVariants } from "@mui/material";

interface FormInputFieldProps<T extends FieldValues> {
	name: Path<T>; // Use Path<T> instead of string
	control: Control<T>; // Assuming Control is from react-hook-form
	id?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	fullWidth?: boolean;
	variant?: TextFieldVariants;
	autoComplete?: string;
	defaultValue?: string | number;
	multiline?: boolean;
	rows?: number;
	required?: boolean;
}

export default function FormInputField<T extends FieldValues>({
	id,
	name,
	control,
	label,
	placeholder,
	className,
	fullWidth,
	variant = "outlined",
	autoComplete,
	defaultValue,
	multiline = false,
	rows,
	required,
}: FormInputFieldProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<TextField
					id={id}
					name={name}
					helperText={error ? error.message : null}
					// error could be null, so double negating it turns it to a boolean value
					// So null => true => false
					error={!!error}
					onChange={onChange}
					value={value}
					label={label}
					placeholder={placeholder}
					variant={variant}
					className={className}
					fullWidth={fullWidth}
					defaultValue={defaultValue}
					multiline={multiline}
					rows={rows}
					inputProps={{
						autoComplete: autoComplete,
					}}
					required={required}
				/>
			)}
		/>
	);
}
