import * as yup from "yup";

const titleSchema = yup
	.string()
	.required("Title is required")
	.matches(
		/^[a-zA-Z0-9\s]+$/,
		"Title can include alphanumerics and whitespace, and must be between 1 and 50 characters!"
	);
const descriptionSchema = yup
	.string()
	.required("Description is required")
	.max(500, "Description must be between 1 to 500 characters");

const categorySchema = yup.object().shape({
	title: titleSchema,
	description: descriptionSchema,
});

export default categorySchema;