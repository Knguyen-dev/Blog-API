import * as yup from "yup";
const titleSchema = yup
	.string()
	.required("Please enter a category title!")
	.matches(
		/^[a-zA-Z0-9_]{1,50}$/,
		"Tag title must be between 1 and 50 characters long and can only contain letters, numbers, and underscores."
	);

export { titleSchema };
