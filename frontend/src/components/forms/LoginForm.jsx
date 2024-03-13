import { Button, Divider, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormInputField from "../Input/FormInputField";
import FormPasswordField from "../Input/FormPasswordField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../hooks/user/useLogin";

// Only validation we need here is just making sure the user has entered actual values
const validationSchema = yup.object().shape({
	username: yup.string().required("Please enter your username"),
	password: yup.string().required("Please enter your password"),
});

export default function LoginForm() {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const location = useLocation();
	const navigate = useNavigate();

	const { error, isLoading, login, submitDisabled } = useLogin();

	const onSubmit = async (formData) => {
		// Attempt to login, on success our route handling will automatically redirect us.
		// Else on fail, our error will be shown on the form.
		const success = await login(formData);

		/*
    - Smart Redirects: If successful login, redirect them to where they wanted to go before the redirect
		 Else default to dashboard if they only went to the login page.
    */
		if (success) {
			navigate(location.state?.from || "/dashboard");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="tw-text-center tw-mb-4">
				<Typography variant="h3">Login</Typography>
			</div>

			<div className="tw-flex tw-flex-col tw-gap-y-2 tw-mb-2">
				<FormInputField
					id="username"
					name="username"
					control={control}
					label="Username"
					autoComplete="username"
				/>
				<FormPasswordField
					id="password"
					name="password"
					control={control}
					label="Password"
					autoComplete="current-password"
				/>

				<Button
					variant="contained"
					disabled={isLoading || submitDisabled}
					type="Submit">
					Login
				</Button>
			</div>

			{/* Rendering a potential server error */}
			{error && <div className="error">{error}</div>}

			<Divider className="tw-my-4" />

			<div>
				<Typography className="tw-text-center">
					Don&apos;t have an account?{" "}
					<Link
						to="/auth/signup"
						className="tw-no-underline hover:tw-underline">
						Sign Up
					</Link>
				</Typography>

				<Typography className="tw-text-center">
					Forgot your{" "}
					<Link
						to="/auth/forgotUsername"
						className="tw-no-underline hover:tw-underline">
						username
					</Link>{" "}
					or your{" "}
					<Link
						to="/auth/forgotPassword"
						className="tw-no-underline hover:tw-underline">
						password
					</Link>
					?
				</Typography>
			</div>
		</form>
	);
}
