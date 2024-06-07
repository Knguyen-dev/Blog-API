import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box } from "@mui/material";
import FormInputField from "../../../../components/Input/FormInputField";
import FormPasswordField from "../../../../components/Input/FormPasswordField";
import { changeEmailSchema } from "../data/userSchema";
import useChangeEmail from "../hooks/useChangeEmail";
import { IChangeEmailFormData } from "../../../../types/Auth";
import FormError from "../../../../components/Input/FormError";

interface IEditEmailForm {
  email: string;
  onSuccess: (successMessage: string) => void;
}

export default function EditEmailForm({ email, onSuccess }: IEditEmailForm) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(changeEmailSchema),
    defaultValues: {
      email: "", // new email that user is changing to
      password: "",
    },
  });

  const { error, setError, isLoading, changeEmail } = useChangeEmail();

  const onSubmit = async (formData: IChangeEmailFormData) => {
    /*
    - If the email they submitted, matches the current user's email, then
		no changes will be made, so stop the request early.
    */
    if (formData.email === email) {
      setError("New email must be different from current one!");
      return;
    }

    // Attempt to change the email and get the success message
    const successMessage = await changeEmail(formData);

    // If successful, close the form and run onSuccess
    if (successMessage) {
      onSuccess(successMessage);
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
        <FormInputField
          id="email"
          name="email"
          control={control}
          label="New Email"
        />
        <FormPasswordField
          id="password"
          name="password"
          control={control}
          label="Password"
        />

        {/* Conditionally render error */}
        {error && <FormError message={error} sx={{ marginTop: 2 }} />}

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}>
          <Button variant="contained" type="submit" disabled={isLoading}>
            Update
          </Button>
        </Box>
      </Box>
    </form>
  );
}
