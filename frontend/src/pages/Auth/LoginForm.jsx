import { Button, Divider, Typography, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../../components/Input/PasswordField";
import useLogin from "./hooks/useLogin";

/*
- NOTE: You could use react-hook-form, but I feel that it's kind of overkill to use 
  it, especially when the validation is extremely basic, and we only need the values 
  at the time of submission.
*/
export default function LoginForm() {
	const location = useLocation();
	const navigate = useNavigate();

	const { error, setError, isLoading, login } = useLogin();

	// Handle form submission
	const onSubmit = async (e) => {
		// Prevent default form submission and get form data
		e.preventDefault();
		const formData = new FormData(e.target);

		/*
    - Get the username and password, trim it since username and password don't allow whitespace anyways.
    
    - NOTE: Check if the fields are empty. Even though our form controls have 'required' attribute, the user could have entered white space for 
      both fields, so we trim it down and then check it.
    */
		const username = formData.get("username").trim();
		const password = formData.get("username").trim();
		if (!username || !password) {
			setError({
				message: "Username and password fields must be filled out!",
			});
			return;
		}

		// Make request to login
		const success = await login(formData);

		/*
    - Smart Redirects: If successful login, redirect them to where they wanted to go before the redirect
		 Else default to dashboard, which happens in cases where they didn't go to any other 
     page before the login page.
    */
		if (success) {
			navigate(location.state?.from || "/dashboard");
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<div className="tw-text-center tw-mb-4">
				<Typography variant="h3" component="h2">
					Login
				</Typography>
			</div>

			<div className="tw-flex tw-flex-col tw-gap-y-2 tw-mb-2">
				{/* Create fields for username and password, make them required so the user can't enter empty strings */}
				<TextField
					id="username"
					name="username"
					label="Username"
					autoComplete="username"
					required
				/>
				<PasswordField
					id="password"
					name="password"
					label="Password"
					autoComplete="current-password"
					required
				/>
				<Button variant="contained" disabled={isLoading} type="Submit">
					Login
				</Button>
			</div>

			{/* Rendering a potential server error */}
			{error && <div className="error">{error.message}</div>}

			<Divider className="tw-my-4" />

			<div>
				<Typography className="tw-text-center">
					Don&apos;t have an account?{" "}
					<Link to="/auth/signup" aria-label="Go to user registration page">
						Sign Up
					</Link>
				</Typography>

				<Typography className="tw-text-center">
					Forgot your{" "}
					<Link
						to="/auth/forgotUsername"
						aria-label="Go to forgot username page">
						username
					</Link>{" "}
					or your{" "}
					<Link
						to="/auth/forgotPassword"
						aria-label="Go to forgot password page">
						password
					</Link>
					?
				</Typography>
			</div>
		</form>
	);
}
