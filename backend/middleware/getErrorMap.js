const {validationResult} = require("express-validator");
/**
 * Returns an object, where each key is a field, and the value is the error
 * message for that field, if there's an error. For example, {username: "some_username_error", fullName: "some_full_name_error"}.
 * 
 * @param {object} req - Request object
 * @returns {object} An object containing the field names as keys and values as error messages.
 */
const getErrorMap = (req) => {
  return validationResult(req).errors.reduce((errorMap, e) => {
			return {
				...errorMap,
        // Map the fieldname: fieldname's error message
				[e.path]: e.msg,
			};
		}, {});
}

module.exports = getErrorMap;