import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Typography } from "@mui/material";
import FormPasswordField from "../Input/FormPasswordField";
import useDeleteAccount from "../../hooks/user/useDeleteAccount";
import useToast from "../../hooks/useToast";

import PropTypes from "prop-types";
import { confirmPasswordSchema } from "../../constants/validationSchemas";

const validationSchema = yup.object().shape({
	password: yup.string().required("Please enter your current password"),
	confirmPassword: confirmPasswordSchema,
});

export default function DeleteAccountForm() {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});
	const { error, isLoading, deleteAccount, submitDisabled } =
		useDeleteAccount();
	const { showToast } = useToast();

	const onSubmit = async (formData) => {
		const { success, data } = await deleteAccount(formData);

		// If successful, handle showing the snackbar
		if (success) {
			showToast({
				message: data.message,
				severity: "success",
			});
		} else if (data) {
			// Else if unsuccessful and data is defined (failed due to server validation)
			// Then set the error fields.
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
			{/* Form input fields */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					rowGap: 2,
				}}>
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

				{/* Conditionally render other errors (server, unexpected, etc.)*/}
				{error && (
					<Box className="error">
						<Typography>{error}</Typography>
					</Box>
				)}

				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
					}}>
					<Button
						variant="contained"
						color="warning"
						type="submit"
						disabled={isLoading || submitDisabled}>
						Delete
					</Button>
				</Box>
			</Box>
		</form>
	);
}
DeleteAccountForm.propTypes = {
	handleCloseForm: PropTypes.func,
};
