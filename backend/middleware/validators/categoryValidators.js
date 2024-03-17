const {body} = require("express-validator");
const categoryValidators = {
  title: body("title").trim()
    .isLength({min: 1, max: 100})

    /*
    - Title is alphanumeric and accepts spaces. However, we won't allow consecutive 
      whitespace, because that will cause problems when creating a slug.
      
      For example, "My   long title" and 'my long title' both map to the slug 'my-long-title'.
      So preventing this would make finding duplicate titles a lot easier, and 
      make ensuring that slugs are unique a lot easier.

    - Regex:

    1. (?!.*\s{2}): Negative lookahead ensures regex doesn't contain two consecutive spaces.
    2. [a-zA-Z0-9\s]+: Ensures regex matches to one or more alphanumeric characters or white space characters.

    */
    
     .matches(/^(?!.*\s{2})[a-zA-Z0-9\s]+$/)
    .withMessage("Title must be alphanumeric and between 1 and 100 characters! No consecutive whitespace!"),
  description: body("description").trim().isLength({min: 1, max: 500}).withMessage("Description must be between 1 and 500 characters!")
}
module.exports = categoryValidators;