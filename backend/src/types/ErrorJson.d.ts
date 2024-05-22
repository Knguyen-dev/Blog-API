import { CustomValidationError } from "./CustomValidationError"

/*
- When sending back the errors in json, we'll say that there will be an error message, and 
a statusCode property to show the user the status code of the response. Then we will say that 
there may be an additional field called 'details' that gives the details of any specific form
fields that caused the error, in the cases where an error is caused via some form input. 


*/
export interface ErrorJson {
  message: string,
  statusCode: number, 

  // ErrorJson doesn't have to have the details property
  details?: CustomValidationError[]
}