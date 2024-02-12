import { Button, Divider, Typography } from "@mui/material";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useEffect } from "react";

import useSignup from "../../hooks/useSignup";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import FormInputField from "../Input/FormInputField";
import FormPasswordField from "../Input/FormPasswordField";

const validationSchema = yup.object().shape({
	email: yup
		.string()
		.required("Please enter an email!")
		.max(64, "Maximum email length is 64 characters!")
		.email("Not a valid email format!"),

	/*
  - Username regex: An alphanumeric string between 1 to 32 characters.
  */
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
	/*
  - Password Regex: Basically ensures that a passowrd contains 1 lower case 
    letter, one upper case letter, one digit, and 1 special character.
  */
	password: yup
		.string()
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,40}$/,
			"Password needs to be 8 to 40 characters, and must have one uppercase letter, lowercase letter, symbol, and one number."
		),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match!"),
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

	const { handleOpen } = useOutletContext();
	const navigate = useNavigate();

	const { formErrors, serverError, isLoading, signup } = useSignup();

	/*
  - Render server side form errors when 'formErrors' change. So this 
    would happen everytime we went through client-side validation
    and actually made a request to the server. 
  
  - NOTE: The reason it's in an effect is because we want to display
    the messages after submission, and after the render with the states 
    are complete.
  */

	useEffect(() => {
		if (formErrors) {
			Object.keys(formErrors).forEach((fieldName) => {
				setError(fieldName, {
					type: "server",
					message: formErrors[fieldName],
				});
			});
		}
	}, [formErrors, setError]);

	const onSubmit = async (formData) => {
		const success = await signup(
			formData.email,
			formData.username,
			formData.password,
			formData.confirmPassword,
			formData.fullName
		);

		/*
    - Conditionals:
    - On success redirect the user to the login page and open the snackbar.
    */
		if (success) {
			handleOpen();
			return navigate("/auth/login");
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
			{serverError && <div className="error">{serverError}</div>}

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
