import { Button, Divider, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLogin from "./hooks/useLogin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../components/Input/FormInputField";
import FormPasswordField from "../../components/Input/FormPasswordField";
import FormError from "../../components/Input/FormError";
import { ILoginFormData } from "../../types/Auth";
import { loginSchema } from "../Dashboard/Profile/data/userSchema";

/**
 * Form that handles logging in a user
 */
export default function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, isLoading, login } = useLogin();
  const { control, handleSubmit } = useForm<ILoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (formData: ILoginFormData) => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tw-text-center tw-mb-4">
        <Typography variant="h3" component="h2">
          Login
        </Typography>
      </div>

      <div className="tw-flex tw-flex-col tw-gap-y-2 tw-mb-2">
        {/* Create fields for username and password, make them required so the user can't enter empty strings */}
        <FormInputField<ILoginFormData>
          id="username"
          name="username"
          control={control}
          label="Username"
        />
        <FormPasswordField<ILoginFormData>
          id="password"
          name="password"
          control={control}
          autoComplete="current-password"
          label="Password"
        />
        <Button variant="contained" disabled={isLoading} type="submit">
          Login
        </Button>
      </div>

      {/* Rendering a potential server error */}
      {error && <FormError message={error} />}

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
