const userValidators = require("../../../middleware/validators/userValidators");




describe("email validation", () => {
  test("should pass for valid email formats", async () => {
    const validEmails = [
      "user@example.com",
      'user.name@example.com',
      'user+tag@example.com',
      'user_name@example-domain.com',
      'user123@example.co.uk',
    ]

    const req = {
      body: {}
    }

    for (const email of validEmails) {
      req.body.email = email;
      const validationResult = await userValidators.email.run(req);

      /*
      - Since jest doesn't provide useful info for this test, we'll create 
        custom logging to see which email was invalid.
      */
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for email: ${email}`);
      }

      expect(validationResult.isEmpty()).toBe(true);
    }
  });

  test("should fail for invalid email formats", async() => {
    const invalidEmails = [
      // No email
      "",
      // No @ symbol
      "userexample.com",
      // No Domain part 
      "user@",
      // no local part
      "@example.com",
      // missing local and domain parts
      "@.com",
      // missing domain
      "user@.com",
      // missing top-level domain
      "user@example",
      // special characters in domain part
      "user@example<!>.com",
      // special characters in local part
      "user<>!@example.com",
      // extra period at the end
      "user@example.com.",
      // consecutive dots
      "user..@example.com",
      // consecutive @ symbols
      "user@@example.com",

      // email with 65 characters; maximum right now is 64
      "a".repeat(53) + "@example.com"

    ]

    const req = {
      body: {}
    }

    for (const email of invalidEmails) {
      req.body.email = email;
      const validationResult = await userValidators.email.run(req);

      /*
      - If an email we expected to be invalid, as marked as valid, log it.
      */
      if (validationResult.isEmpty()) {
        console.log(`Validation failed for email: ${email}`);
        console.log(validationResult.array());
      }

      // Expecting for validationResult to caught the errors for these invalid emails
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("username validation", () => {
  test("should pass for valid usernames", async () => {

    const validUsernames = [
      'user123',
      'john_doe123',
      'user_name',
      'johndoe1234',
      'user_name_123',
      'user123_name',
      'johndoe_123',
      'user_123',
      'john123_doe',
      'j_doe_123'
    ];

    const req = {
      body: {}
    }

    for (const username of validUsernames) {
      req.body.username = username;
      const validationResult = await userValidators.username.run(req);

      /*
      - Since jest doesn't provide useful info for this test, we'll create 
        custom logging to see which email was invalid.
      */
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for username: ${username}`);
      }

      expect(validationResult.isEmpty()).toBe(true);
    }


  })

  test("should fail for invalid usernames", async () => {
    
    const invalidUsernames = [
      "",               // Empty string
      null,             // Null value
      "user 123",       // Username with space
      "user@name",      // Username with special character (@)
      "user!name",      // Username with special character (!)
      "user#name",      // Username with special character (#)
      "user$name",      // Username with special character ($)
      "user%name",      // Username with special character (%)
      "user^name",      // Username with special character (^)
      "short",          // username that is below 6 characters
      "a".repeat(33),   // username that is above 32 characters
      "_".repeat(8),    // username that is only underscores
      "1".repeat(8),    // username that is only numbers
    ];
    const req = {
      body: {}
    }

    for (const username of invalidUsernames) {
      req.body.username = username;
      const validationResult = await userValidators.username.run(req);

      // If username was valid, log out the username.
      if (validationResult.isEmpty()) {
        console.log(`Validation failed for username: ${username}`);
      }

      // Expecting validationResult to have errors
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("password validation", () => {

  test("should pass for valid passwords", async () => {
    const validPasswords = [
      'My#Password*123', 
      'MyPassword123!',
      'SecureP@ssword1',
      '1234Abcd!',
      'P@ssw0rd!',
      'Secret123#',
      'Pa$$w0rd',
      'MyP@55w0rd!',
      'Complex!Passw0rd',
      '1qaz@WSX',
    ];

    const req = {
      body: {}
    }

    for (const password of validPasswords) {
      req.body.password = password;
      const validationResult = await userValidators.password.run(req);

      /*
      - Since jest doesn't provide useful info for this test, we'll create 
        custom logging to see which email was invalid.
      */
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for password: ${password}`);
      }
      expect(validationResult.isEmpty()).toBe(true);
    }

  })

  test("should fail for invalid passwords", async() => {
    const invalidPasswords = [
      "",                   // Empty string
      null,                 // Null value
      "short",              // Too short (less than 8 characters)
      "aA1#".repeat(10) + "3",  // Too long (41 characters, exceeding the maximum length of 40)
      "asdfdijedjs",        // Lowercased letters only (no uppercase, numbers, or symbols)
      "ASDFKLEJF",          // Uppercased letters only (no lowercase, numbers, or symbols)
      "12398773",           // Numbers only (no letters or symbols)
      "!@#$%^&*",         // symbols only (no letters or numbers)
      "My B4#nd number",    // Contains whitespace (whitespace isn't allowed)
    ];

    const req = {
      body: {}
    }

    for (const password of invalidPasswords) {
      req.body.password = password;
      const validationResult = await userValidators.password.run(req);

      if (validationResult.isEmpty()) {
        console.log(`Validation failed for password: ${password}`);
      }

      // Expecting errors since these are invalid passwords
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

// describe("fullName validation", () => {
  
// })

// describe("role validation", () => {
  
// })