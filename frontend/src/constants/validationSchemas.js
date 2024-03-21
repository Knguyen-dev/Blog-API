/*
+ validationSchemas: File where we create and export all of the yup
  validation schemas that we use in some of our forms such as the 
  sign up form, or the 'edit username' form. As a result 
  everything is kept in one place so whenever we want to change our 
  validation rules, we only have to make changes here.
*/

import * as yup from "yup";

const emailSchema = yup
	.string()
	.required("Please enter an email!")
	.max(64, "Maximum email length is 64 characters!")
	.email("Not a valid email format!");

const usernameSchema = yup
	.string()
	.required("Username is required!")
	.matches(
		/^[a-zA-Z0-9]{1,32}$/,
		"Username must be alphanumeric and 1-32 characters long."
	);

const fullNameSchema = yup
	.string()
	.required("Please enter your name!") // remember that 'required' covers the minimum length of 1.
	.max(64, "Full name has a maximum length of 64 characters!");

/*
- Password Regex: Basically ensures that a passowrd contains 1 lower case 
  letter, one upper case letter, one digit, and 1 special character.
*/
const passwordSchema = yup
	.string()
	.matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,40}$/,
		"Password needs to be 8 to 40 characters, and must have one uppercase letter, lowercase letter, symbol, and one number."
	);

// Schema ensures field 'password' has the same value as the current field.
// This schema will be placed on the 'confirmPassword' field.
const confirmPasswordSchema = yup
	.string()
	.oneOf([yup.ref("password"), null], "Passwords must match!");

export {
	emailSchema,
	usernameSchema,
	fullNameSchema,
	passwordSchema,
	confirmPasswordSchema,
};
