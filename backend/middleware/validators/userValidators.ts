import {body} from "express-validator";
import {roles_map} from "../../config/roles_map";
const userValidators = {
  /**
   * Validates the email of the user.
   * 
   * @params {string} email - Email that the user wants to sign up with
   */
  email: body("email")
		.trim()
		.escape()
		.isEmail()
		.withMessage("Not a valid email!")
		.isLength({
			max: 64,
		})
		.withMessage("Maximum email length is 64 characters"),

  /**
   * Validates the username that the user wants to sign up with.
   * 
   * @params {string} username - Username that the user wants to create an account with
   */
  username: body("username")
		.trim()
		.escape()
		.custom(username => {
      const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{6,32}$/
      return usernameRegex.test(username)
    }).withMessage("Username has to be between 6-32 characters. Can have letters, numbers, and underscores. Has to have at least one letter!"),

  /**
   * Validates the password of the user.
   * 
   * @params {string} password - Password that the user wants to secure their account with.
   */
  password: body("password")
		.trim()
    .custom(password => {
      /*
      + Password regex, same as the one on the front-end:
      1. ^: start of the string
      2. (?=.*[a-z]): Checks for at least one lower case letter
      3. (?=.*[A-Z]): Checks for at least one upper case letter
      4. (?=.*\d): Checks for at least one digit
      5. (?=.*[!@#$%^&*]): Checks for at least one of those 'special' characters listed between the brackets
      6. (?!.*\s): No white spaces for entire string, which makes sense since it's a password.
      7. .{8, 40}: String is at least 8 characters and at most 40.
      8. $: End of the string
      */
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,40}$/;
      return passwordRegex.test(password);
    }).withMessage("Password needs to be 8 to 40 characters, and must have one uppercase letter, lowercase letter, symbol, and one number."),
  
  /**
   * Middleware that checks the 'password' and 'confirmPassword' properties are equal
   * 
   * @params {string} confirmPassword - The value of the 'confirmPassword' field. This value should match the 'password' field
   * 
   */
  confirmPassword: body("confirmPassword")
		.custom((confirmPassword, { req }) => {
			return confirmPassword === req.body.password;
		})
		.withMessage("Passwords must match!"),
  
  /**
   * Validates the fullName property 
   * 
   * @params {string} fullName - The full name that will be displayed for the user.
   */
  fullName: body("fullName")
		.trim()
		.escape()
		.isLength({
			min: 1,
			max: 64,
		})
		.withMessage("Full name must be within 1 to 64 characters"),

  /**
   * Sanitizes and valiates the 'role' of a user. We ensure 'role' is a number by sanitizing it 
   * and then we validate that it's a valid role that we support.
   * 
   * @params {string} role - A string that can be converted into a number, that will numerically represent
   *                        a user's role.
   */
  role: body("role")
    .trim()
    .escape()
    .customSanitizer(role => parseInt(role))
    .custom(role => {
      return Object.values(roles_map).includes(role);
    }).withMessage("Role is not valid!"),
}

export default userValidators;