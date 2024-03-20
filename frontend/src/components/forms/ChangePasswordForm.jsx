import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import FormPasswordField from "../Input/FormPasswordField";
import useChangePassword from "../../hooks/user/useChangePassword";
import PropTypes from "prop-types";
import useToast from "../../hooks/useToast";

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
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { showToast } = useToast();

	const { error, isLoading, changePassword, submitDisabled } =
		useChangePassword();

	const onSubmit = async (formData) => {
		const success = await changePassword(formData);
		if (success) {
			showToast({
				message: "Password Change Successful! Please log back in.",
				severity: "success",
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
					<Button
						variant="contained"
						type="submit"
						disabled={isLoading || submitDisabled}>
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
