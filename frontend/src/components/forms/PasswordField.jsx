import { IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import PropTypes from "prop-types";

export default function PasswordField({
	variant,
	name,
	placeholder,
	label,
	value,
	helperText,
	error,
	onChange,
	required,
	className,
}) {
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDown = (e) => e.preventDefault();
	return (
		<TextField
			name={name}
			label={label}
			placeholder={placeholder}
			helperText={helperText}
			variant={variant}
			onChange={onChange}
			required={required}
			value={value}
			error={error}
			type={showPassword ? "text" : "password"}
			className={className}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={toggleShowPassword}
							onMouseDown={handleMouseDown}
							edge="end">
							{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
}
PasswordField.propTypes = {
	variant: PropTypes.string,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string,
	helperText: PropTypes.string,
	error: PropTypes.bool,
	onChange: PropTypes.func,
	required: PropTypes.bool,
	className: PropTypes.string,
};
