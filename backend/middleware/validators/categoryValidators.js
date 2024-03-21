const {body} = require("express-validator");
const categoryValidators = {
  /**
   * Title is alphanumeric and accepts spaces. However, we won't allow consecutive 
   * whitespace, because that will cause problems when creating a slug.
   * 
   * - Regex: 
   * 1. (?!.*\s{2}): Negative lookahead ensures regex doesn't contain two consecutive spaces.
   * 2. [a-zA-Z0-9\s]+: Ensures regex matches to one or more alphanumeric characters or white space characters.
   */
  title: body("title").trim()
    .isLength({min: 1, max: 100})
     .matches(/^(?!.*\s{2})[a-zA-Z0-9\s]+$/)
    .withMessage("Title must be alphanumeric and between 1 and 100 characters! No consecutive whitespace!"),

  /**
   * Validator for the description of the category.
   */
  description: body("description").trim().isLength({min: 1, max: 500}).withMessage("Description must be between 1 and 500 characters!")
}
module.exports = categoryValidators;