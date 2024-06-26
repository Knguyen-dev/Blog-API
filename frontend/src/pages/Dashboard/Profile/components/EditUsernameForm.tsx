import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box } from "@mui/material";
import FormInputField from "../../../../components/Input/FormInputField";
import PropTypes from "prop-types";
import useChangeUsername from "../hooks/useChangeUsername";
import { usernameSchema } from "../data/userSchema";
import { IChangeUsernameFormData } from "../../../../types/Auth";
import FormError from "../../../../components/Input/FormError";

interface IEditUsernameFormProps {
  username: string;
  onSuccess: () => void;
}

const validationSchema = yup.object().shape({
  username: usernameSchema,
});

export default function EditUsernameForm({
  username,
  onSuccess,
}: IEditUsernameFormProps) {
  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username, // username parameter represents the user's current username
    },
  });

  const { error, isLoading, changeUsername } = useChangeUsername();

  const onSubmit = async (formData: IChangeUsernameFormData) => {
    /*
    - If submitted username matches the user's current username, nothing 
      changes so we don't bother making a call to the server. Stop function
      call early and set an error message on the form field.
    
    */
    if (formData.username === username) {
      setError("username", {
        type: "client",
        message: "New username must be different from current one!",
      });
      return;
    }

    const success = await changeUsername(formData);

    // If success and onSuccess is defined, call our optional onSuccess function
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
        }}>
        <FormInputField
          id="username"
          name="username"
          control={control}
          label="Username"
          variant="standard"
        />

        {/* Conditionally render error */}
        {error && <FormError message={error} sx={{ marginTop: 2 }} />}

        {/* Form action buttons */}
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
EditUsernameForm.propTypes = {
  onSuccess: PropTypes.func,
  username: PropTypes.string,
};
