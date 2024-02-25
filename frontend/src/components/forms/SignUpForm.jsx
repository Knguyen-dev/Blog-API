import { Button, Divider, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useSignup from "../../hooks/user/useSignup";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../Input/FormInputField";
import FormPasswordField from "../Input/FormPasswordField";
import {
	emailSchema,
	usernameSchema,
	fullNameSchema,
	passwordSchema,
	confirmPasswordSchema,
} from "../../constants/validationSchemas";
import useSnackbar from "../../hooks/useSnackbar";

const validationSchema = yup.object().shape({
	email: emailSchema,
	username: usernameSchema,
	fullName: fullNameSchema,
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema,
});

/*
+ React Hook Form:
- register: Use this function to link your input fields to react-hook. So 
  here in my first field, I'm registering that input field as 'email', so now
  react-hook-form knows that is the 'email' field. In here you can define any
  conditions for your input fields to be valid.
- handleSubmit: Wrap this around your real form submission function. When the user 
  submits the form, all input fields that we registered will be validated.
*/
export default function SignUpForm() {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			email: "",
			username: "",
			fullName: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { showSnackbar } = useSnackbar();

	// function for opening the snackbar, which we'll display on successful registration
	const navigate = useNavigate();

	const { error, isLoading, signup } = useSignup();

	const onSubmit = async (formData) => {
		const { success, data } = await signup(formData);
		/*
    - Conditionals:
    1. On success redirect the user to the login page and open the snackbar.
      Here 'data' would be the object with the success message created by the server, so 
      something like 'User registration successful!'

    2. Else, it wasn't a success. Could have been server-side validation
      error so check if 'data' is defined to render out error messages.
    3. Else, it wasn't a success and it didn't fail due to the user's input, 
      so there was a server error. This error is updated in our error state.
    */
		if (success) {
			showSnackbar({
				message: data.message,
				severity: "success",
			});
			return navigate("/auth/login");
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
			<div className="tw-text-center tw-mb-4">
				<Typography variant="h3">Sign Up</Typography>
			</div>

			{/* Form input fields */}
			<div className="tw-flex tw-flex-col tw-gap-y-2 tw-mb-2">
				<FormInputField
					id="email"
					name="email"
					control={control}
					label="Email"
				/>
				<FormInputField
					id="username"
					name="username"
					control={control}
					label="Username"
				/>
				<FormInputField
					id="fullName"
					name="fullName"
					control={control}
					label="Full Name"
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

				<Button variant="contained" disabled={isLoading} type="submit">
					Sign Up
				</Button>
			</div>

			{/* Rendering a potential server error */}
			{error && <div className="error">{error}</div>}

			<Divider className="tw-my-4" />

			{/* Container for extra stuff in the form such as 'or' login */}
			<div>
				<Typography className="tw-text-center">
					Already a user?{" "}
					<Link to="/auth/login" className="tw-no-underline hover:tw-underline">
						Login
					</Link>
				</Typography>
			</div>
		</form>
	);
}
