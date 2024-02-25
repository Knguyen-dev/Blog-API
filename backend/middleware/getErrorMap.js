const {validationResult} = require("express-validator");
/*
+ Extracts an error map from an array of validation errors.
  The error map is an object where each key is the path of the error (e.g., field name)
  and the value is the error message. For example if we have fields 
  {username: some_username, fullName: some_full_name, etc..}, then the error
  map would be {username: some_username_error} if we have a server-side validation
  error with the username. The fieldnames in the errorMap will be the fields that 
  we detected to have server-side validation errors!


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