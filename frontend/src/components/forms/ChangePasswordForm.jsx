import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, Box, Button } from "@mui/material";
import FormPasswordField from "../Input/FormPasswordField";

const validationSchema = yup.object().shape({
	// Old Password
	oldPassword: yup.string().required("Please enter your old password"),

	// New Password
	password: yup
		.string()
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,40}$/,
			"Password needs to be 8 to 40 characters, and must have one uppercase letter, lowercase letter, symbol, and one number."
		),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match!"),
});

export default function ChangePasswordForm({ handleCloseForm }) {
	const { control, handleSubmit, setError } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (formData) => {
		console.log(formData);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* Form header */}
			<Box sx={{ textAlign: "left", marginBottom: 1 }}>
				<Typography variant="h6">Change Password</Typography>
			</Box>

			<Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
				<FormPasswordField
					id="oldPassword"
					name="oldPassword"
					control={control}
					label="Old Password"
				/>
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

				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						columnGap: 2,
						marginTop: 2,
					}}>
					<Button variant="outlined" onClick={handleCloseForm}>
						Cancel
					</Button>
					<Button variant="contained" type="submit">
						Update
					</Button>
				</Box>
			</Box>
		</form>
	);
}
