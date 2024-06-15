import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldVariants,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

/**
 * A custom password field component that allows you to toggle the visibility of the
 * input (allows the user to hide or show their password).
 */
interface PasswordFieldProps {
  variant?: TextFieldVariants;
  id?: string;
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  helperText?: string;
  error?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}

export default function PasswordField({
  variant,
  id,
  name,
  placeholder,
  label,
  value,
  helperText,
  error,
  onChange,
  required,
  className,
  autoComplete,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => e.preventDefault();

  return (
    <TextField
      id={id}
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
        autoComplete: autoComplete,
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
