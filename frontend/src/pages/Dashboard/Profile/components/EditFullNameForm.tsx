import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box } from "@mui/material";
import FormInputField from "../../../../components/Input/FormInputField";
import PropTypes from "prop-types";
import useChangeFullName from "../hooks/useChangeFullName";
import { fullNameSchema } from "../data/userSchema";
import { IChangeFullNameFormData } from "../../../../types/Auth";
import FormError from "../../../../components/Input/FormError";

interface IEditFullNameProps {
  fullName: string;
  onSuccess: () => void;
}

const validationSchema = yup.object().shape({
  fullName: fullNameSchema,
});

export default function EditFullNameForm({
  fullName,
  onSuccess,
}: IEditFullNameProps) {
  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: fullName,
    },
  });

  const { error, isLoading, changeFullName } = useChangeFullName();
  const onSubmit = async (formData: IChangeFullNameFormData) => {
    /*
    - If submitted name isn't different from current account's name
      then even if the changes went through, the user's name didn't really 
      change. That would be a waste of server resources, so stop execution
      early and set an error message.

    */
    if (formData.fullName === fullName) {
      setError("fullName", {
        type: "client",
        message: "New name must be different from the current one!",
      });
      return;
    }

    const success = await changeFullName(formData);
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
          id="fullName"
          name="fullName"
          control={control}
          label="Full Name"
          variant="standard"
        />

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
EditFullNameForm.propTypes = {
  onSuccess: PropTypes.func,
  fullName: PropTypes.string,
};
