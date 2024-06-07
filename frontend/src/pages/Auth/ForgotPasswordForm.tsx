import { Box, Typography, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputField from "../../components/Input/FormInputField";
import { forgotPasswordSchema } from "../Dashboard/Profile/data/userSchema";
import useForgotPassword from "./hooks/useForgotPassword";
import { IForgotPasswordFormData } from "../../types/Auth";
import useToast from "../../hooks/useToast";
import FormError from "../../components/Input/FormError";

export default function ForgotPasswordForm() {
  const { showToast } = useToast();

  const { control, handleSubmit } = useForm<IForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { error, isLoading, requestPasswordResetLink } = useForgotPassword();

  const onSubmit = async (formData: IForgotPasswordFormData) => {
    const successMessage = await requestPasswordResetLink(formData);

    if (successMessage) {
      showToast({
        message: successMessage,
        autoHideDuration: 30000,
        severity: "success",
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Header of the form */}
      <Box component="header" className="tw-text-center tw-mb-4">
        <Typography variant="h5" component="h1">
          Forgot Your Password?
        </Typography>
        <Typography variant="body1">
          Enter your email address and we'll send you a link to reset your
          password.
        </Typography>
      </Box>

      {/* Form fields and submit button */}
      <Box className="tw-flex tw-flex-col tw-gap-y-2">
        <FormInputField<IForgotPasswordFormData>
          id="email"
          name="email"
          control={control}
          label="Email"
        />
        <Button variant="contained" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </Box>

      {/* We'll show any errors here */}
      {error && <FormError message={error} className="tw-mt-4" />}

      <Divider className="tw-my-4" />

      <Box className="tw-text-center">
        <Typography variant="body1" component="p">
          Go back to <Link to="/auth/login">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
}
