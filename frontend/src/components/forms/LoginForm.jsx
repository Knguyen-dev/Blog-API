import { Button, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import FormInputField from "../Input/FormInputField";
import FormPasswordField from "../Input/FormPasswordField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../hooks/useLogin";

// Effect for testing
import { useEffect } from "react";

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
	const { error, isLoading, login } = useLogin();

	// Auto logins for us when rendering LoginForm
	useEffect(() => {
		const preLogin = async () => {
			await login("Mario70", "P$ssword_123");
		};

		preLogin();
	}, [login]);

	const onSubmit = async (data) => {
		await login(data.username, data.password);
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

				<Button variant="contained" disabled={isLoading} type="Submit">
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
					</Link>{" "}
					?
				</Typography>
			</div>
		</form>
	);
}
