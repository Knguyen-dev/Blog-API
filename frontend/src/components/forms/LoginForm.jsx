import { Button, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormInputField from "../Input/FormInputField";
import FormPasswordField from "../Input/FormPasswordField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../hooks/user/useLogin";

// Effect for testing
import { useEffect } from "react";

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
	const { error, isLoading, login, submitDisabled } = useLogin();

	// Auto logins for us when testing rendering LoginForm
	useEffect(() => {
		const loginRoleUser = async () => {
			await login({ username: "Mario70", password: "P$ssword_123" });
		};

		const loginRoleEditor = async () => {
			await login({ username: "grandcreamfraiche", password: "P$ssword_123" });
		};

		const loginRoleAdmin = async () => {
			await login({ username: "kbizzzyycentral", password: "P$ssword_123" });
		};

		// loginRoleAdmin();
	}, [login]);

	const onSubmit = async (formData) => {
		// Attempt to login, on success our route handling will automatically redirect us.
		// Else on fail, our error will be shown on the form.
		await login(formData);
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
				/>
				<FormPasswordField
					id="password"
					name="password"
					control={control}
					label="Password"
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
