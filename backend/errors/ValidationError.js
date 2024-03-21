/**
 * Custom error class for database validation errors. Specifically we'll use this 
 * when doing database checks on specific fields such as "username", "title", etc. so that we get an 'error.details'
 * object. It's the idea of aligning our error fomrat with the 'handleValidationErrors'
 * middleware.
 * @class ValidationError
 * @extends Error
 * 
 */
class ValidationError extends Error {
  /**
   * Creates an instance of ValidationError
   * @param {string} field The name of the field associated with the validation error e.g. 'username'
   * @param {string} message The error message for the validation error
   * @param {number} [statusCode=400] The HTTP status code associated with the error
   */
  constructor(field, message, statusCode = 400) {
    super(message);
    this.field = field;
    this.statusCode = statusCode;
    this.details = {
      [field]: message 
    }
  }

  /**
   * Customizes how instances of ValidationError will look like when turned
   * into json. Here we wanted the format to match what we're returning in 
   * the middleware function 'handleValidationErrors'
   * 
   */
  toJSON() {
    return {
      error: {
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
      }
    }
  }
  /*
  - When calling JSON.stringify on an object, JavaScript automatically looks
    for a toJSON method on that object and uses it to determine how the object
    should be converted to JSON. So we just need to call JSON.stringify and 
    JavaScript does the rest of the work for us.
  */


}

module.exports = ValidationError;