const categoryValidators = require("../../../middleware/validators/categoryValidators");

describe("validating title", () => {
  test("should pass for valid titles", async () => {
    const validTitles = [
      "music", // all lowercase
      "Sports", // lower and upper 
      "Top 10 things about cards", // has spaces and numbers
      "a".repeat(50), // length is at upper limit
      "a",  // length is at lower limit 
    ];
    const req = {
      body:{}
    }

    for (const title of validTitles) {
      req.body.title = title;
      const validationResult = await categoryValidators.title.run(req);

      if (!validationResult.isEmpty()) {
        console.log("Validation failed for title: ", title);
      }

      // Expecting it to pass with no errors
      expect(validationResult.isEmpty()).toBe(true);
    }
  });

  test("should fail for invalid titles", async () => {
    const invalidTitles = [
      null, // lower and upper 
      "", // empty string
      "     ", // has spaces and numbers
      "a".repeat(51), // length is above upper limit of 50 haracters
      "#The World", // has special characters
      "This is retro-sports", // also has special characters
      
    ];
    const req = {
      body:{}
    }

    for (const title of invalidTitles) {
      req.body.title = title;
      const validationResult = await categoryValidators.title.run(req);

      if (validationResult.isEmpty()) {
        console.log("Validation passed for title: ", title);
      }

      // Expecting it to have errors
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("validating description", () => {
  test("should pass for valid descriptions", async () => {

    const validDescriptions = [
      "a", // minimum length
      "Description with spaces", // description with upper-case, lower-case, and spaces
      "A better description!", // description with special characters
      "a".repeat(500) // maximum length
    ]

    const req = {
      body: {}
    };

    for (const description of validDescriptions) {
      req.body.description = description;

      const validationResult = await categoryValidators.description.run(req);
      if (!validationResult.isEmpty()) {
        console.log("Validation failed for description: ", description);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }

  })

  test("should fail for invalid descriptions", async () => {
    const invalidDescriptions = [
      "",       // empty string; below the lower limit.
      null,     // null
      "    ",    // only spaces
      "a".repeat(501), // length is above upper limit of 500 haracters
    ];

    const req = {
      body: {}
    };

    for (const description of invalidDescriptions) {
      req.body.description = description;
      const validationResult = await categoryValidators.description.run(req);
      if (validationResult.isEmpty()) {
        console.log("Validation passed for description: ", description);
      }
      // Expecting it to have errors
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
});