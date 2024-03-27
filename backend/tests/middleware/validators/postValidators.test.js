// Some mock post statuses
const mockPostStatuses = {
  status1: "First Status",
  status2: "Second Status",
  status3: "Third Status",
  status4: "Fourth Status",
  status5: "Fifth Status",
}

jest.mock("../../../config/post_status_map", () => (mockPostStatuses));

const postValidators = require("../../../middleware/validators/postValidators");


/*
The idea is to purify it in the test function and compare what the validator brought
back. If they're both equal, that means the custom sanitizer is doing its job correctly.

*/
const createDOMPurify = require("dompurify");
const {JSDOM} = require("jsdom");




describe("title validation", () => {

  test("should pass for valid titles", async () => {
    const validTitles = [
      "This is a title",
      "Top 10 things about cards!",
      "This is #amazing title!",
      "a".repeat(100),
      "a", 
    ]

    const req ={
      body: {}
    }

    for (const title of validTitles) {
      req.body.title = title;
      const validationResult = await postValidators.title.run(req);
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for title: ${title}`);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }
  })

  test("should fail for invalid titles", async () => {
    const invalidTitles = [

      "",             // empty string
      null,           // null
      "a".repeat(101) // over 100 character limit
    ]

    const req ={
      body: {}
    }

    for (const title of invalidTitles) {
      req.body.title = title;
      const validationResult = await postValidators.title.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for title: ${title}`);
      }
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("wordCount validation", () => {
  test("should pass if wordcount is within deviation", async () => {

    const scenarios = [
      // Reported word count is above estimation AND within deviation
      {
        estimatedWordCount: 200,
        reportedWordCount: 210,
        deviation: 20, 
      },
      // Reported word count is below estimation AND within deviation
      {
        estimatedWordCount: 150,
        reportedWordCount: 145,
        deviation: 10,
      },
      {
        // Scenario 3: Edge case: Reported word count equals estimated word count
        estimatedWordCount: 180,
        reportedWordCount: 180,
        deviation: 20,
      },
      {
        // Scenario 4: Word count exactly at upper limit of deviation
        estimatedWordCount: 300,
        reportedWordCount: 320,
        deviation: 20,
      },
      {
        // Scenario 5: Word count exactly at lower limit of deviation
        estimatedWordCount: 1000,
        reportedWordCount: 980,
        deviation: 20,
      },
    ]

    for (const scenario of scenarios) {
      const result = postValidators.validateWordCount(scenario.estimatedWordCount, scenario.reportedWordCount, scenario.deviation);
      expect(result).toBe(true);
    }

  })

  test("should fail if wordCount is outside of deviation", async () => {
    const scenarios = [
      // Reported wordCount is above estimation and outside of deviation
      {
        estimatedWordCount: 200,
        reportedWordCount: 225,
        deviation: 20, 
      },
      // Reported wordCount is below estimation and outside of deviation
      {
        estimatedWordCount: 200,
        reportedWordCount: 175,
        deviation: 20, 
      },
    ];
    for (const scenario of scenarios) {
      const result = postValidators.validateWordCount(scenario.estimatedWordCount, scenario.reportedWordCount, scenario.deviation);
      expect(result).toBe(false);
    }
  })
})

describe("body sanitization", () => {

  test("should sanitize html strings", async () => {
    const htmlStrings = [
      "<script>alert('XSS attack!');</script><p>Hello, world!</p>",
      "<img src=x onerror='alert(\"XSS attack!\")' />",
      "<a href='javascript:alert(\"XSS attack!\")'>Click me</a>",
      "<svg/onload=alert('XSS attack!')>",
      "<iframe src='javascript:alert(\"XSS attack!\")'></iframe>",
    ];
    const req = {
      body: {}
    }

    for (const htmlStr of htmlStrings) {
      req.body.body = htmlStr;
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window);
      const sanitizedHtml = DOMPurify.sanitize(htmlStr);
      await postValidators.body.run(req);

      // Now compare the html string on the request to the sanitized html
      // They should be the same html string
      expect(req.body.body).toBe(sanitizedHtml);  
    }
  })
})

describe("status validation", () => {
  test("should pass for valid statuses", async () => {
    // Get an array of the valid values that we have in our mock
    const validStatuses = Object.values(mockPostStatuses);
    const req = {
      body: {}
    }
    for (const status of validStatuses) {
      req.body.status = status;
      const validationResult = await postValidators.status.run(req);
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for status: ${status}`);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }
  })

  test("should fail for invalid statuses", async() => {
    const invalidStatuses = [
      null,      // null; status needs to be defined
      "",        // isn't a valid status
      "some-invalid-status", // isn't a valid status
      ["Array"], // isn't a valid status
    ]
    const req = {
      body: {}
    }
    for (const status of invalidStatuses) {
      req.body.status = status;
      const validationResult = await postValidators.status.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for status: ${status}`);
      }
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("tags validation", () => {
  test("should pass if tags property isn't given", async () => {
    const req ={
      body: {}
    }

    const validationResult = await postValidators.tags.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for tags: ${tags}`);
    }
    expect(validationResult.isEmpty()).toBe(true);
  })

  test("should pass for valid tags", async () => {
    const validTags = [
      [], // empty array
      ['id_1', 'id_2', 'id_3'], // array of strings
    ]
    const req = {
      body: {}
    }
    for (const tags of validTags) {
      req.body.tags = tags;

      const validationResult = await postValidators.tags.run(req);
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for tags: ${tags}`);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }    
  });

  test("should fail for invalid tags", async () => {
    const invalidTags = [
      "",                                 // empty string
      null,                               // null
      1,                                  // number
      [1,2,3],                            // array of numbers
      {tags: ["a", "b", "c"]},            // object
      ["id_1", "id_2", "id_3", 4],        // strings and numbers
      ["id_1", "id_2", "id_3", null],     // strings and null
      ["id_1", "id_2", "id_3", undefined] // strings and undefined
    ]
    const req = {
      body: {}
    }
    for (const tags of invalidTags) {
      req.body.tags = tags;

      const validationResult = await postValidators.tags.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for tags: ${tags}`);
      }
      expect(validationResult.isEmpty()).toBe(false);
    }    
  })
})
  
describe("category validation", () => {
  test("should pass when category is a non-empty string", async () => {
    const req = {
      body: {
        category: "some_category_id"
      }
    }
    const validationResult = await postValidators.category.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for category: ${req.body.category}`);
    }
    expect(validationResult.isEmpty()).toBe(true);
  })

  test("should fail for invalid categories", async () => {
    /*
    - Note about express-validator: Numbers and javascript objects are converted into 
    strings when they are passed into express validator, because express-validator wants to work
    with strings. However, arrays aren't converted into strings. What this implies is that 
    even the request body somehow has an integer for a value such as 'category' it
    will be converted into a string. Of course we have setups in place to check if 
    it's a valid category from the string, which covers us fully.
    */
    const invalidCategories = [
      "",
      null,
      [1,2,3],
      ["hi"],
      "   ",
    ]
    const req = {
      body: {}
    }

    for (const category of invalidCategories) {
      req.body.category = category
      const validationResult = await postValidators.category.run(req);

      // If it passed validation, then log it
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for category: ${req.body.category}`);
      }

      // Expecting errors
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("imgSrc validation", () => {
  // should pass if img source not provided
  test("should pass if img source isn't provided", async () => {
    const req = {
      body: {}
    }

    const validationResult = await postValidators.imgSrc.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for category: ${req.body.category}`);
    }

    // Expecting it to pass without errors
    expect(validationResult.isEmpty()).toBe(true);
  })
  
  test("should pass if image source is valid string", async() => {
    const req = {
      body: {
        imgSrc: "some-image-source",
      }
    }
    const validationResult = await postValidators.imgSrc.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for category: ${req.body.category}`);
    }

    // Expecting it to pass without errors
    expect(validationResult.isEmpty()).toBe(true);
  })

  test("should fail if image source is invalid", async() => {
    const invalidImgSrcs = [
      null,
      "",
      "   ",
      ["some_array"],
    ]

    const req = {
      body: {}
    }

    for (const imgSrc of invalidImgSrcs) {
      req.body.imgSrc = imgSrc;
      const validationResult = await postValidators.imgSrc.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for imgSrc: ${imgSrc}`);
      }

      // Expecting it to have errors
      expect(validationResult.isEmpty()).toBe(false);
    }

  })
})

describe("imgCredits validation", () => {
  test("should pass if img credits aren't provided", async() => {
    const req = {
      body: {}
    }

    const validationResult = await postValidators.imgCredits.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for providing no image credits!`);
    }

    // Expecting it to pass without errors
    expect(validationResult.isEmpty()).toBe(true);
  })

  test("should pass if img credits is a valid string", async() => {
    const req = {
      body: {
        imgCredits: "some-image-credits"
      }
    };

    const validationResult = await postValidators.imgCredits.run(req);
    if (!validationResult.isEmpty()) {
      console.log(`Validation failed for image credits: ${req.body.imgCredits}`);
    }

    // Expecting it to pass without errors
    expect(validationResult.isEmpty()).toBe(true);
  })

  test("should fail if img credits are invalid", async() => {

    const invalidImgCredits = [
      null,
      "",
      "  ",
      ["some_array"],
    ]

    const req = {
      body: {}
    }

    for (const imgCredits of invalidImgCredits) {
      req.body.imgCredits = imgCredits;
      const validationResult = await postValidators.imgCredits.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for image credits: ${imgCredits}`);
      }
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})