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
*/

import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

export default function FormInputField({
	id,
	name,
	control,
	label,
	placeholder,
	className,
}) {
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
					variant="outlined"
					className={className}
				/>
			)}
		/>
	);
}
FormInputField.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	control: PropTypes.object,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	className: PropTypes.string,
};
