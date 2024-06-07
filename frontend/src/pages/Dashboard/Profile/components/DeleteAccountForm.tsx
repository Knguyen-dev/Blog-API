import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box } from "@mui/material";
import FormPasswordField from "../../../../components/Input/FormPasswordField";
import useDeleteAccount from "../hooks/useDeleteAccount";
import useToast from "../../../../hooks/useToast";
import { deleteAccountSchema } from "../data/userSchema";
import { IDeleteAccountFormData } from "../../../../types/Auth";
import FormError from "../../../../components/Input/FormError";

export default function DeleteAccountForm() {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { error, isLoading, deleteAccount } = useDeleteAccount();
  const { showToast } = useToast();

  const onSubmit = async (formData: IDeleteAccountFormData) => {
    const success = await deleteAccount(formData);

    // If successful, handle showing the snackbar
    if (success) {
      showToast({
        message: "Successfully deleted account!",
        severity: "success",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form input fields */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
        }}>
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

        {/* Conditionally render other errors (server, unexpected, etc.)*/}
        {error && <FormError message={error} sx={{ marginTop: 2 }} />}

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}>
          <Button
            variant="contained"
            color="warning"
            type="submit"
            disabled={isLoading}>
            Delete
          </Button>
        </Box>
      </Box>
    </form>
  );
}
