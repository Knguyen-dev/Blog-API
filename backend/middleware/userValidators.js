const {body} = require("express-validator");
const roles_list = require("../config/roles_list");


const userValidator = {
  email: body("email")
		.trim()
		.escape()
		.isEmail()
		.withMessage("Not a valid email!")
		.isLength({
			max: 64,
		})
		.withMessage("Maximum email length is 64 characters"),
  username: body("username")
		.trim()
		.escape()
		.isLength({ min: 1, max: 32 })
		.withMessage(
			"Username has to be within 1 to 32 characters and alphanumeric!"
		)
		.isAlphanumeric()
		.withMessage(
			"Username has to be within 1 to 32 characters and alphanumeric!"
		),
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
  confirmPassword: body("confirmPassword")
		.custom((confirmPassword, { req }) => {
			return confirmPassword === req.body.password;
		})
		.withMessage("Passwords must match!"),
  fullName: body("fullName")
		.trim()
		.escape()
		.isLength({
			min: 1,
			max: 64,
		})
		.withMessage("Full name must be within 1 to 64 characters"),

  role: body("role")
    .trim()
    .escape()
    .custom( role => {
      role = parseInt(role); // convert role to number
      return Object.values(roles_list).includes(role);
    }).withMessage("Role is not valid!"),

  employeeRole: body("role")
    .trim()
    .escape()
    .custom( role => {
      role = parseInt(role); // convert role to number

      // Employees must have a valid role, and it can't be 'user' role.
      return Object.values(roles_list).includes(role) && role!== roles_list.user;
    }).withMessage("Employee must have a valid employee role!"),
}
  
module.exports = userValidator;