import PasswordField from "./PasswordField";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormPasswordFieldProps<T extends FieldValues> {
	id?: string;
	name: Path<T>; // Use Path<T> instead of string
	control: Control<T>;
	label?: string;
	placeholder?: string;
	className?: string;
	autoComplete?: string;
}

export default function FormPasswordField<T extends FieldValues>({
	id,
	name,
	control,
	label,
	placeholder,
	className,
	autoComplete,
}: FormPasswordFieldProps<T>) {
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
