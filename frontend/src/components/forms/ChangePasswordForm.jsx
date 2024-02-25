import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import FormPasswordField from "../Input/FormPasswordField";
import useChangePassword from "../../hooks/user/useChangePassword";
import PropTypes from "prop-types";
import useSnackbar from "../../hooks/useSnackbar";

import {
	passwordSchema,
	confirmPasswordSchema,
} from "../../constants/validationSchemas";

const validationSchema = yup.object().shape({
	// Old/Current Password
	oldPassword: yup.string().required("Please enter your current password"),

	// New Password
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema,
});

export default function ChangePasswordForm() {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { showSnackbar } = useSnackbar();

	const { error, isLoading, changePassword } = useChangePassword();

	const onSubmit = async (formData) => {
		const { success, data } = await changePassword(formData);
		if (success) {
			showSnackbar({
				message: data.message,
				severity: "success",
			});
		} else if (data) {
			Object.keys(data).forEach((fieldName) => {
				setError(fieldName, {
					type: "server",
					message: data[fieldName],
				});
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
				<FormPasswordField
					id="oldPassword"
					name="oldPassword"
					control={control}
					label="Old Password"
				/>
				<FormPasswordField
					id="password"
					name="password"
					control={control}
					label="Password"
				/>
				<FormPasswordField
					id="confirmPassword"
					name="confirmPassword"
					control={control}
					label="Confirm Password"
				/>

				{/* Render general errors*/}
				{error && <Box className="error">{error}</Box>}

				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						marginTop: 1,
					}}>
					<Button variant="contained" type="submit" disabled={isLoading}>
						Submit
					</Button>
				</Box>
			</Box>
		</form>
	);
}
ChangePasswordForm.propTypes = {
	handleCloseForm: PropTypes.func,
};
