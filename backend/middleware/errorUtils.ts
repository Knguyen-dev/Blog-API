import { validationResult } from "express-validator";
import {Request, Response, NextFunction} from "express";
import { CustomValidationError } from "../types/CustomValidationError";
import { ErrorJson } from "../types/ErrorJson";
import CustomError from "../config/CustomError";



/**
 * Handles syntax/string validation, formatting those errors, and sending those errors the error handling middleware 
 * server if necessary
 * 
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {

  /*
  - Error data will be a map with field names as keys, and objects with error information as values. We'll
  create an array of objects with field name and an appropriate error message.
  */

  const errorData = validationResult(req).mapped();
  const errorList: CustomValidationError[] = Object.keys(errorData).map(field => ({
      field,
      message: errorData[field].msg
  }));

  // Create a concatenated error message, containing all errors messages.
  let errorMessage = "";  

  errorMessage = createErrorMessage(errorList)

  // If there were validation errors, send it to error handling middleware
  if (errorList.length !== 0) {
    const err = createError(400, errorMessage, errorList);
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
const createErrorMessage = (data: CustomValidationError[] = []): string => {
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
function createError(statusCode: number, message: string, data?: CustomValidationError[]) {
  // If there was no error message, create a concatenated message
  if (!message) {
    message = createErrorMessage(data);
  }

  // Create an error object
  const err = new CustomError(message, statusCode, data);

  return err;
}


/**
 * Creates json format from an a given error object.
 * 
 * 
 * 
 * NOTE: We should be able to support unexpected errors and the CustomError instances we create.
 * Which is why we conditionally check statusCode and details
 * 
 * @param {Error} err - Error object.
 * @returns object - JSON format that we want to send errors back in
 */
function jsonifyError(err: CustomError): ErrorJson {
  const json: ErrorJson = {
    message: err.message,
    statusCode: err.statusCode
  };

  // If the .details property was defined, then add it onto our ErrorJson
  if (err.details) {
    json.details = err.details;
  }
  return json;
}

export {
  handleValidationErrors,
  createError,
  createErrorMessage,
  jsonifyError,
};


