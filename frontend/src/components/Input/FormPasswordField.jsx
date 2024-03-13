import PasswordField from "./PasswordField";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

export default function FormPasswordField({
	id,
	name,
	control,
	label,
	placeholder,
	className,
	autoComplete,
}) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<PasswordField
					id={id}
					name={name}
					helperText={error ? error.message : null}
					error={!!error}
					onChange={onChange}
					value={value}
					label={label}
					placeholder={placeholder}
					className={className}
					autoComplete={autoComplete}
				/>
			)}
		/>
	);
}

FormPasswordField.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	control: PropTypes.object,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	autoComplete: PropTypes.string,
};
