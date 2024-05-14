const { validationResult } = require("express-validator");


/**
 * Handles syntax/string validation 
 * 
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {*} next - Function for going to the next middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errorData = validationResult(req).errors.map(e => {
    return {
      field: e.path,
      message: e.msg,
    }
  })

  // Create a concatenated error message, containing all errors messages.
  let errorMessage = "";  

  errorMessage = createErrorMessage(errorData)

  // If there were validation errors, send it to error handling middleware
  if (errorData.length !== 0) {
    const err = createError(400, errorMessage, errorData);
    return next(err);
  }

  next();
}


/**
 * Creates a combined error message of all errors listed in data array
 * 
 * @param {array} data - Array of objects containing error field and message.
 * @returns string
 */
const createErrorMessage = (data=[]) => {
  let message = "";
  data.forEach((e, index) => {
    if (index === data.length - 1) {
      message += `${e.message}`;
    } else {
      message += `${e.message} `;
    }
  })
  return message;
}


/**
 * 
 * @param {integer} statusCode - Http status code
 * @param {string} message - Error message 
 * @param {array} data - An array of objects containing the fields that failed validation and 
 *                      caused this error. Note that this is optional because not all errors are 
 *                      going to be caused by input validation from the user.
 * @returns Error object 
 */
function createError(statusCode, message, data = []) {
  // If there was no error message, create a concatenated message
  if (!message) {
    message = createErrorMessage(data);
  }

  // Create an error object
  const err = new Error(message); // assign message
  err.statusCode = statusCode; // assign statusCode property

  // If data has error object, then create a details
  if (data.length > 0) {
    err.details = data;
  }
  return err;
}

/**
 * Creates json format from an a given error object.
 * 
 * @param {Error} err - Error object ideally.
 * @returns object - JSON format that we want to send errors back in
 */
function jsonifyError(err) {
  const json = {
    message: err.message,
  };
  if (err.statusCode) {
    json.statusCode = err.statusCode;
  }
  if (err.details) {
    json.details = err.details;
  }
  return json;
}

module.exports = {
  handleValidationErrors,
  createError,
  createErrorMessage,
  jsonifyError,
  
};