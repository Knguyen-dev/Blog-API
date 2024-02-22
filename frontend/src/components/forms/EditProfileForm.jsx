import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, Button, Box } from "@mui/material";
import FormInputField from "../Input/FormInputField";
import PropTypes from "prop-types";

const validationSchema = yup.object().shape({
	email: yup
		.string()
		.required("Please enter an email!")
		.max(64, "Maximum email length is 64 characters!")
		.email("Not a valid email format!"),
	username: yup
		.string()
		.required("Username is required!")
		.matches(
			/^[a-zA-Z0-9]{1,32}$/,
			"Username must be alphanumeric and 1-32 characters long."
		),
	fullName: yup
		.string()
		.required("Please enter your name!")
		.max(64, "Full name has a maximum length of 64 characters!"),
});

export default function EditProfileForm({
	username,
	email,
	name,
	handleCloseForm,
}) {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			username,
			name,
			email,
		},
	});

	const onSubmit = async (formData) => {
		console.log(formData);

		/*
    - We want only one call to the server to update our user's 'profile', which
      is just a certain set of stuff right here. In order to have one round 
      trip, one endpoint, but separate functions for updating such as 
      update profile (updates certain fields like username, email, etc.) or 
      change password (changes password field), then in your backend you 
      must only update fields that are present in the req.body. Update only keys
      that are present

    - NOTE: Also on the front end form, don't let our form submit if 
      literally none of the fields have changed. It's alright if one field 
      has changed but others haven't, for example 'updating the username' but 
      leaving the email and full name unchanged. But if nothing has changed 
      then we don't want to use resources.

    - Also the endpoint should be in form /user/:userid to be like restful.
      Also for changing password, we probably should use a different endpoint 
      that has logic for logging us out.
    
    */

		// If successful we update the global user state, rather than do another api fetch
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* Form header */}
			<Box sx={{ textAlign: "left", marginBottom: 1 }}>
				<Typography variant="h6">Update Profile</Typography>
			</Box>

			{/* Form input fields */}

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
				}}>
				<FormInputField
					id="username"
					name="username"
					control={control}
					label="username"
					variant="standard"
				/>
				<FormInputField
					id="email"
					name="email"
					control={control}
					label="email"
					variant="standard"
				/>
				<FormInputField
					id="name"
					name="name"
					control={control}
					label="name"
					variant="standard"
				/>

				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						columnGap: 2,
						marginTop: 2,
					}}>
					<Button variant="outlined" onClick={handleCloseForm}>
						Cancel
					</Button>
					<Button variant="contained" type="submit">
						Update
					</Button>
				</Box>
			</Box>
		</form>
	);
}
EditProfileForm.propTypes = {
	username: PropTypes.string,
	email: PropTypes.string,
	name: PropTypes.string,
	handleCloseForm: PropTypes.func,
};
