const {body} = require("express-validator");
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");
const post_status_map = require("../../config/post_status_map");

/*
+ Function used to get word count from HTML string. Not 100% accurate
  but it gets very close. 

*/
function getWordCount(htmlContent) {
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return wordCount;
}

/*
+ Function used to check if the reported word count is within a range 
  estimated by our function. Here we'll allow 25 words on either side
  so if our r

- NOTE: This function is useful as we'll use it to determine the approximate
  word count, and check the validity of the 'wordCount' property sent through 
  the request body. We will allow deviation of about '25' words.
*/

function validateWordCount(estimatedWordCount, reportedCount, deviation) {
  if (reportedCount > estimatedWordCount + deviation || reportedCount < estimatedWordCount - deviation) {
    return false;
  }
  return true;
}




const postValidators = {
  // Title of the post
  title: body("title").trim().isLength({
    min: 1,
    max: 100
  }).withMessage("Post title must be between 1 and 100 characters long!"),

  /*
  + wordCount: Reported number of words that the post has.
  + Note:
  1. Regex cannot accurately remove all HTML tags from a string, making accurate word count challenging, 
    which is why we have to estimate sometimes.
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


  /*
  - The body of the post is going to be an html string. For the body, we want 
  to let a word limit on the stuff. Of course we can rely on the client to side 
  the word-count to us, but we'd like to have backend validation.
  - Sanitize the string with DOMPurify.  
  */
  body: body("body").customSanitizer(body => {
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(body);
  }),

  // Status of the post 'string';
  status: body("status")
    .isIn(Object.keys(post_status_map))
    .withMessage("Post must be in one of the following statuses: draft, published, private."),

  /*
  + tags: An optional array of tag IDs, which should be strings. This valiator ensures that 
    'req.body.tags' is an array, and if it does have values, then those values are strings.
    So at minimum 'tags' should be an empty array.
  */
  tags: body("tags").optional().isArray().withMessage("'tags' property must be an array containing tag IDs as strings!").custom(tags => {
    // If there are elements, ensure all elements are just strings
    if (tags.length > 0 && !tags.every(tagID => typeof tagID === "string")) {
      throw new Error("If 'tags' array has elements, they must be strings representing the ID of the tag!");
    }

    // Return true when validation passes
    return true;
  }),
  
  // category: A string containing the ID of the category that the post belongs in.
  category: body("category").isLength({min: 1}).withMessage("Category ID for the post is required!"),

  /*
  - imgSrc and imgCredits are optional fields in the postSchema, but if they are provided
    then we need to ensure that they are at least strings.
  */
  imgSrc: body("imgSrc").optional().isString().withMessage("Image source for the post needs to be a string."),
  imgCredits: body("imgCredits").optional().isString().withMessage("Image credits need to be a string."),
}
module.exports = postValidators;
