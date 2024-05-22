import { CustomValidationError } from "../types/CustomValidationError";

// Create custom error class that builds upon JavaScript's built-in error class
class CustomError extends Error {
  // Add two new properties
  // Response status code
  public statusCode: number;
  // Optional details array
  public details?: CustomValidationError[];

  constructor(message: string, statusCode: number, details?: CustomValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default CustomError;