import {body} from "express-validator";

const categoryValidators = {
  /**
   * Title is alphanumeric and accepts spaces. However, we won't allow consecutive 
   * whitespace, because that will cause problems when creating a slug.
   * 
   * - Regex: 
   * 1. [a-zA-Z0-9\s]+: Ensures regex matches to one or more alphanumeric characters or white space characters.
   */
  title: body("title").trim()
    .isLength({min: 1, max: 50})
     .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Title can include alphanumerics and whitespace, and must be between 1 and 50 characters!"),

  /**
   * Validator for the description of the category.
   */
  description: body("description").trim().isLength({min: 1, max: 500}).withMessage("Description must be between 1 and 500 characters!")
}


export default categoryValidators;