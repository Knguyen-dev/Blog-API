import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../Dashboard/Profile/data/userSchema";
import FormPasswordField from "../../components/Input/FormPasswordField";
import FormError from "../../components/Input/FormError";
import useResetPassword from "./hooks/useResetPassword";
import { IResetPasswordFormData } from "../../types/Auth";
import useToast from "../../hooks/useToast";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<IResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { passwordResetToken } = useParams();
  const { error, isLoading, resetPassword } = useResetPassword();

  // If no passwordResetToken in the router parameter, then redirect the user
  if (!passwordResetToken) {
    navigate("/not-found");
    return;
  }

  const onSubmit = async (formData: IResetPasswordFormData) => {
    const success = await resetPassword(passwordResetToken, formData);

    if (success) {
      showToast({
        message: "Password was successfully updated!",
      });
      navigate("/auth/login");
    }

    // If successful, navigate to a page says password reset was successful
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box component="header" className="tw-text-center tw-mb-4">
        <Typography variant="h5" component="h1">
          Reset your password
        </Typography>
        <Typography variant="body1">Enter in your new password</Typography>
      </Box>

      {/* Form fields and submit button */}
      <Box className="tw-flex tw-flex-col tw-gap-y-2">
        <FormPasswordField<IResetPasswordFormData>
          id="password"
          name="password"
          control={control}
          label="Password"
        />
        <FormPasswordField<IResetPasswordFormData>
          id="confirmPassword"
          name="confirmPassword"
          control={control}
          label="Confirm Password"
        />
        <Button variant="contained" type="submit" disabled={isLoading}>
          Reset Password
        </Button>
      </Box>

      {/* We'll show any errors here */}
      {error && <FormError message={error} className="tw-mt-4" />}
    </Box>
  );
}
