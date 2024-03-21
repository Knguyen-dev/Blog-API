const {body} = require("express-validator");

/*
+ Regex:
1. (?!__): Negative lookahead ensures two consecutive underscores aren't allowed.
2. [a-zA-Z0-9_]+: Matches one or more alphanumeric characters or underscores.
3. [a-zA-Z0-9_]*: Optionally matches zero or more alphanumeric characters or underscores.
  This allows for tags where the initial character is an underscore and there are 
  characters following it.
*/


const tagValidators = {

  /**
   * Validates the 'title' of the tag.
   * 
   * @params {string} title - The title of the post
   */
  title: body("title").trim()
    .isLength({min: 1, max: 50})
    // Title is alphanumeric and can accept underscores
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Hashtag title must be between 1 and 50 characters long and can only contain letters, numbers, and underscores")
}



module.exports = tagValidators;