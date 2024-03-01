import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Typography } from "@mui/material";
import FormInputField from "../Input/FormInputField";
import PropTypes from "prop-types";

import { emailSchema } from "../../constants/validationSchemas";
import useChangeEmail from "../../hooks/user/useChangeEmail";

const validationSchema = yup.object().shape({
	email: emailSchema,
});

export default function EditNameForm({ email, handleCloseForm }) {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			email, // represents current user's email
		},
	});

	const { error, isLoading, changeEmail, submitDisabled } = useChangeEmail();

	const onSubmit = async (formData) => {
		/*
    - If the email they submitted, matches the current user's email, then
		no changes will be made, so stop the request early.
    */
		if (formData.email === email) {
			setError("email", {
				type: "client",
				message: "New email must be different from current one!",
			});
			return;
		}

		// Attempt to change the email
		const success = await changeEmail(formData);

		// If successful, close the form
		if (success) {
			handleCloseForm();
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
				<FormInputField
					id="email"
					name="email"
					control={control}
					label="Email"
					variant="standard"
				/>

				{/* Conditionally render error */}
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
						type="submit"
						disabled={isLoading || submitDisabled}>
						Update
					</Button>
				</Box>
			</Box>
		</form>
	);
}
EditNameForm.propTypes = {
	handleCloseForm: PropTypes.func,
	email: PropTypes.string,
};
