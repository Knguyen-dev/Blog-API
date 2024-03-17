const {validationResult} = require("express-validator");
const getErrorMap = require("./getErrorMap");



/*
+ Handles validation related errors that we define with express-validator.
  

- NOTE: When we define validation-related errors, we just mean errors involving 
  user input. Things that the user inputs from the client side.
*/

const handleValidationErrors = (req, res, next) => {
  const errorDetails = getErrorMap(req);


  // Create a concatenated error message, containing all errors messages.
  let errorMessage = "";  
  Object.values(errorDetails).forEach((e, index) => {  
    if (index === Object.values(errorDetails).length - 1) {
      errorMessage += `${e}`;
    } else {
      errorMessage += `${e} `;
    }
    
  })

  // If there were validation errors, send them back
  if (Object.keys(errorDetails).length !== 0) {
    return res.status(400).json({
      error: {
        status: 400,
        message: errorMessage, // string containing all error messages 
        details: errorDetails // object containing the fields, and their respective error messages
      }
    });
  }

  next();
}

module.exports = handleValidationErrors;