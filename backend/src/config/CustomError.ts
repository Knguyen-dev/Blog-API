import { CustomValidationError } from "../types/CustomValidationError";


/**
 * Create a custom error class that will be used to describe any error processed by the 
 * application
 */
class CustomError extends Error {
  
  // Response status code
  public statusCode: number;
  // Optional details array; this describes potential fields that were invalid and their error message
  public details?: CustomValidationError[];

  constructor(message: string, statusCode: number, details?: CustomValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default CustomError;