import PasswordField from "./PasswordField";
import { Controller, Control } from "react-hook-form";

interface FormPasswordFieldProps {
	id?: string;
	name: string;
	control: Control<any>;
	label?: string;
	placeholder?: string;
	className?: string;
	autoComplete?: string;
}

export default function FormPasswordField({
	id,
	name,
	control,
	label,
	placeholder,
	className,
	autoComplete,
}: FormPasswordFieldProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<PasswordField
					id={id}
					name={name}
					helperText={error ? error.message : undefined}
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
