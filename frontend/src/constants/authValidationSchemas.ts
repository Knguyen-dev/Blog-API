/*
+ validationSchemas: 
  File where we create and export all of the yup
  validation schemas that we use in some of our forms such as the 
  sign up form, or the 'edit username' form. As a result 
  everything is kept in one place so whenever we want to change our 
  validation rules, we only have to make changes here.
*/

import * as yup from "yup";

const emailSchema = yup
	.string()
	.max(64, "Maximum email length is 64 characters!")
	.email("Not a valid email format!")
	.required("Please enter an email!");

const usernameSchema = yup
	.string()
	.matches(
		/^(?=.*[a-zA-Z])[a-zA-Z0-9_]{6,32}$/,
		"Username has to be between 6-32 characters. Can have letters, numbers, and underscores. Has to have at least one letter!"
	)
	.required("Username is required!");
const fullNameSchema = yup
	.string()
	.max(64, "Full name has a maximum length of 64 characters!")
	.required("Please enter your name!"); // remember that 'required' covers the minimum length of 1.;

/*
- Password Regex: Basically ensures that a passowrd contains 1 lower case 
  letter, one upper case letter, one digit, and 1 special character.
*/
const passwordSchema = yup
	.string()
	.matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,40}$/,
		"Password needs to be 8 to 40 characters, and must have one uppercase letter, lowercase letter, symbol, and one number."
	)
	.required("Password is required!");

// Schema ensures field 'password' has the same value as the current field.
// This schema will be placed on the 'confirmPassword' field.
const confirmPasswordSchema = yup
	.string()
	.oneOf([yup.ref("password")], "Passwords must match!")
	.required("Confirm pasword is required!");

const signupValidationSchema = yup.object().shape({
	email: emailSchema,
	username: usernameSchema,
	fullName: fullNameSchema,
	password: passwordSchema,
	confirmPassword: confirmPasswordSchema,
});

const loginValidationSchema = yup.object().shape({
	username: yup.string().required("Username is required"),
	password: yup.string().required("Password is required"),
});

export {
	emailSchema,
	usernameSchema,
	fullNameSchema,
	passwordSchema,
	confirmPasswordSchema,
	signupValidationSchema,
	loginValidationSchema,
};
