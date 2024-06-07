import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box } from "@mui/material";
import FormInputField from "../../../../components/Input/FormInputField";
import { emailSchema } from "../data/userSchema";
import useChangeEmail from "../hooks/useChangeEmail";
import { IChangeEmailFormData } from "../../../../types/Auth";
import FormError from "../../../../components/Input/FormError";

interface IEditEmailForm {
  email: string;
  onSuccess: () => void;
}

const validationSchema = yup.object().shape({
  email: emailSchema,
});

export default function EditEmailForm({ email, onSuccess }: IEditEmailForm) {
  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: email, // represents current user's email
    },
  });

  const { error, isLoading, changeEmail } = useChangeEmail();

  const onSubmit = async (formData: IChangeEmailFormData) => {
    /*
    - If the email they submitted, matches the current user's email, then
		no changes will be made, so stop the request early.
    */
    if (formData.email === email) {
      setError("email", {
        type: "client",
        message: "New email must be different from current one!",
      });
      return;
    }

    // Attempt to change the email
    const success = await changeEmail(formData);

    // If successful, close the form
    if (success && onSuccess) {
      onSuccess();
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
          label="Email"
          variant="standard"
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
