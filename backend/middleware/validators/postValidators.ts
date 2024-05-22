import {body} from "express-validator";
import createDOMPurify from "dompurify";
import {JSDOM} from "jsdom";
import {post_status_map} from "../../config/post_status_map";

/**
 * Calculates the amount of words in an html string.
 * 
 * @param {string} htmlContent - A string containing html markup
 * @returns {number} The number of words in the HTML content
 * 
 * NOTE: This function is accurate, but not perfect, as it's not truly possible to 
 * get the accurate word count from html markup. Which is why this function gets the 
 * 'estimated word count', and we validate that word count.
 */
function getWordCount(htmlContent: string) {
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return wordCount;
}

/**
 * Checks if reported word count is within a specified deviation range 
 * from the estimated word count.
 * 
 * @param {number} estimatedWordCount - The word count that was calculated from 'getWordCount'
 * @param {number} reportedCount - The word count that the client provided 
 * @param {number} deviation - The allowed deviation from estimated word count
 * @returns {boolean} True if the reported count is within deviation range, false if not.
 */
function validateWordCount(estimatedWordCount: number, reportedCount: number, deviation: number) {
  if (reportedCount > estimatedWordCount + deviation || reportedCount < estimatedWordCount - deviation) {
    return false;
  }
  return true;
}

const postValidators = {  
  /**
   * Validates the title of the post 
   * 
   * @params {string} title - Title of the post
   */
  title: body("title").trim().isLength({
    min: 1,
    max: 100
  }).withMessage("Post title must be between 1 and 100 characters long!"),

  /**
   * Validates the title of the post 
   * 
   * @params {string} wordCount: The reported word count of the post
   */
  wordCount: body("wordCount")
    .trim()
    .customSanitizer(wordCount => parseInt(wordCount))
    .custom((wordCount, {req}) => {

      // Check for the existence of the wordCount property
      if (!wordCount) {
        throw new Error("Please provide 'wordCount' property in the request body to report the post's word count!")
      }

      // Get estimated word count for the body of the post and validate the reported word count.
      const estimatedWordCount = getWordCount(req.body.body);
      const deviation = 25;
      if (!validateWordCount(estimatedWordCount, wordCount, deviation)) {
        throw new Error(`The difference between the reported word count (${wordCount}) and the estimated word count (${estimatedWordCount}) was too large, so post rejecetd!`);
      }

      // Word count for the post is accurate, so check to see if it's in range
      const minWordCount = 150; 
      const maxWordCount = 2000;
      if (req.body.wordCount > maxWordCount || req.body.wordCount < minWordCount) {
        throw new Error(`Posts need to have at least ${minWordCount} words and at most ${maxWordCount} words.`);
      }

      // At this point validation was good, so return true for custom validator
      return true;
    }),

  /**
   * Sanitizes the html string with DOMPurify
   * 
   * @params {string} body - An string containing html markup in the post's body or content
   */
  body: body("body").customSanitizer(body => {
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(body);
  }),

  
  /**
   * Validates the status of the post to ensure it's a valid value. 
   * 
   * @params {string} status - Status of the post
   */
  status: body("status")
    .isIn(Object.values(post_status_map))
    .withMessage("Post must be in one of the following statuses: draft, published, private."),

  /**
   * Validates the 'tags' property to ensure that if it is defined, then it's an array 
   * that we can iterate through
   * 
   * @params {array} tags - An array of strings, and those strings are the ID of the tags on that post
   */
  tags: body("tags").optional().isArray().withMessage("'tags' property must be an array containing tag IDs as strings!").custom(tags => {
    // If there are elements, ensure all elements are just strings
    if (tags.length > 0 && !tags.every((tagID: any) => typeof tagID === "string")) {
      throw new Error("If 'tags' array has elements, they must be strings representing the ID of the tag!");
    }

    // Return true when validation passes
    return true;
  }),
  
  /**
   * Validates the 'category' property to ensure it's a defined string. 'category' will be the 
   * ID of the category that is associated with the post
   * 
   * @params {string} category - String representing ID of the category.
   */
  category: body("category")
    .trim()
    .isString()
    .isLength({min: 1})
    .withMessage("Category ID for the post is required!"),

  /**
    * Validates the optional imgSrc property, and ensures it's a string if it's defined.
    * 
    * @params {string} imgSrc - String containing the image source for the post's thumbnail.
    */
  imgSrc: body("imgSrc").optional().isString().trim().isLength({min: 1}).withMessage("Image source for the post needs to be a string."),

  /**
   * Validates the optional imgCredits property, and ensures it's a string if it's defined.
   * 
   * @params {string} imgCredits - String containing the credits for the post's thumbnail.
   */
  imgCredits: body("imgCredits").optional().isString().trim().isLength({min: 1}).withMessage("You need to include credits for your image."),
}
export {
  postValidators, // export validators
  validateWordCount, // export utility function so that we can test it
};

