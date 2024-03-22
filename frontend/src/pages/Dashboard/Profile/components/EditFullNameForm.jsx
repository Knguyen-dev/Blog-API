import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Typography } from "@mui/material";
import FormInputField from "../../../../components/Input/FormInputField";
import PropTypes from "prop-types";
import useChangeFullName from "../hooks/useChangeFullName";
import { fullNameSchema } from "../../../../constants/validationSchemas";
const validationSchema = yup.object().shape({
	fullName: fullNameSchema,
});

export default function EditFullNameForm({ fullName, handleCloseForm }) {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			fullName,
		},
	});

	const { error, isLoading, changeFullName, submitDisabled } =
		useChangeFullName();
	const onSubmit = async (formData) => {
		/*
    - If submitted name isn't different from current account's name
      then even if the changes went through, the user's name didn't really 
      change. That would be a waste of server resources, so stop execution
      early and set an error message.

    */
		if (formData.fullName === fullName) {
			setError("fullName", {
				type: "client",
				message: "New name must be different from the current one!",
			});
			return;
		}

		const success = await changeFullName(formData);
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
					id="fullName"
					name="fullName"
					control={control}
					label="Full Name"
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
EditFullNameForm.propTypes = {
	handleCloseForm: PropTypes.func,
	fullName: PropTypes.string,
};
