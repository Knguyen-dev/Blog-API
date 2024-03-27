const tagValidators = require("../../../middleware/validators/tagValidators");

describe("title validator", () => {

  test("should pass for valid titles", async() => {
    const validTitles = [
      "This_is_a_title",
      "React",
      "Top10",
      "a".repeat(50),
      "a", 
    ];

    const req = {
      body: {}
    }

    for (const title of validTitles) {
      req.body.title = title;
      const validationResult = await tagValidators.title.run(req);
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for title: ${title}`);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }
  });

  test("should fail for invalid titles", async() => {
    const invalidTitles = [
      null,     // null
      "",       // empty string
      "   ",    // only spaces
      "a".repeat(51), // over 50 character limit
      "Spaced title", // title with spaces
      "Funny #Moments" // title with special characters 
    ];
    const req = {
      body: {}
    }
    for (const title of invalidTitles) {
      req.body.title = title;
      const validationResult = await tagValidators.title.run(req);
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for title: ${title}`);
      }
      expect(validationResult.isEmpty()).toBe(false);
    }
  })



})