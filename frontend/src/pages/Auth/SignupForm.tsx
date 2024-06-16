/*
+ React Hook Form:
- register: Use this function to link your input fields to react-hook. So 
  here in my first field, I'm registering that input field as 'email', so now
  react-hook-form knows that is the 'email' field. In here you can define any
  conditions for your input fields to be valid.
- handleSubmit: Wrap this around your real form submission function. When the user 
  submits the form, all input fields that we registered will be validated.
*/

import { Button, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MuiRouterLink from "../../components/MuiRouterLink";
import { useForm } from "react-hook-form";
import useSignup from "./hooks/useSignup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../components/Input/FormInputField";
import FormPasswordField from "../../components/Input/FormPasswordField";
import { signupSchema } from "../Dashboard/Profile/data/userSchema";
import useToast from "../../hooks/useToast";
import { ISignupFormData } from "../../types/Auth";
import FormError from "../../components/Input/FormError";

/**
 * Form for signing up and registering a new user account
 */
export default function SignupForm() {
  const { control, handleSubmit } = useForm<ISignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { showToast } = useToast();

  // function for opening the snackbar, which we'll display on successful registration
  const navigate = useNavigate();

  const { error, isLoading, signup } = useSignup();

  const onSubmit = async (formData: ISignupFormData) => {
    const success = await signup(formData);
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
      showToast({
        message: "User registration successful!",
        severity: "success",
      });
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
        <FormInputField<ISignupFormData>
          id="email"
          name="email"
          control={control}
          label="Email"
        />
        <FormInputField<ISignupFormData>
          id="username"
          name="username"
          control={control}
          label="Username"
        />
        <FormInputField<ISignupFormData>
          id="fullName"
          name="fullName"
          control={control}
          label="Full Name"
        />
        <FormPasswordField<ISignupFormData>
          id="password"
          name="password"
          control={control}
          label="Password"
        />
        <FormPasswordField<ISignupFormData>
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
      {error && <FormError message={error} />}

      <Divider className="tw-my-4" />

      {/* Container for extra stuff in the form such as 'or' login */}
      <div>
        <Typography className="tw-text-center">
          Already a user?{" "}
          <MuiRouterLink to="/auth/login" aria-label="Go to login page">
            Login
          </MuiRouterLink>
        </Typography>
      </div>
    </form>
  );
}
