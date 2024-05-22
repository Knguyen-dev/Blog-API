import {body} from "express-validator";

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
    // Title is alphanumeric and can accept underscores
    .matches(/^[a-zA-Z0-9_]{1,50}$/)
    .withMessage("Tag title must be between 1 and 50 characters long and can only contain letters, numbers, and underscores")
}

export default tagValidators;