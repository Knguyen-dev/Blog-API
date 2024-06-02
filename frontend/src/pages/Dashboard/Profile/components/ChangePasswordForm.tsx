import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import FormPasswordField from "../../../../components/Input/FormPasswordField";
import useChangePassword from "../hooks/useChangePassword";
import PropTypes from "prop-types";
import useToast from "../../../../hooks/useToast";
import { changePasswordSchema } from "../data/userSchema";
import { IChangePasswordFormData } from "../../../../types/Auth";

export default function ChangePasswordForm() {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(changePasswordSchema),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { showToast } = useToast();

	const { error, isLoading, changePassword } = useChangePassword();

	const onSubmit = async (formData: IChangePasswordFormData) => {
		// Attempt to change password; if successful this will logout the user and redirect them to the the login page
		const success = await changePassword(formData);

		// If successful, use our global toast (persists across pages) to tell the user to log back in
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
