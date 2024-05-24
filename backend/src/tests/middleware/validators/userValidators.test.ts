import { describe, test, expect, jest } from "@jest/globals";

/*
+ Create some mock roles:
Since we placed this outside of the 'describe' blocks, this mock is maintained
for all tests, even if we configured it so that mocks are restored/reset after 
each test case.
*/

const mockRoles = {
  role_1: 1, 
  role_2: 2,
  role_3: 3,
  role_4: 4,
  role_5: 5,
}
jest.mock("../../../config/roles_map", () => ({roles_map: mockRoles}));

import userValidators from "../../../middleware/validators/userValidators";

describe("email validation", () => {
  test("should pass for valid email formats", async () => {
    const validEmails = [
      "user@example.com",
      'user.name@example.com',
      'user+tag@example.com',
      'user_name@example-domain.com',
      'user123@example.co.uk',
    ]

    const req: any = {
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

    const req: any = {
      body: {}
    }

    for (const email of invalidEmails) {
      req.body.email = email;
      const validationResult = await userValidators.email.run(req);

      /*
      - If an email we expected to be invalid, as marked as valid, log it.
      */
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for email: ${email}`);
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

    const req: any = {
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
    const req: any = {
      body: {}
    }

    for (const username of invalidUsernames) {
      req.body.username = username;
      const validationResult = await userValidators.username.run(req);

      // If username was valid, log out the username.
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for username: ${username}`);
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

    const req: any = {
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

    const req: any = {
      body: {}
    }

    for (const password of invalidPasswords) {
      req.body.password = password;
      const validationResult = await userValidators.password.run(req);

      if (validationResult.isEmpty()) {
        console.log(`Validation passed for password: ${password}`);
      }

      // Expecting errors since these are invalid passwords
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("confirmPassword validation", () => {
  test("should pass when password and confirm password match", async () => {

    const req = {
      body: {
        password: "MyPassword123",
        confirmPassword: "MyPassword123"
      }
    }
    const validationResult = await userValidators.confirmPassword.run(req);
    
    // We expect there to be no errors.
    expect(validationResult.isEmpty()).toBe(true);

  })

  test("should fail when password and confirm password are different", async () => {
    const req = {
      body: {
        password: "MyPassword123",
        confirmPassword: "DifferentPassword"
      }
    }
    const validationResult = await userValidators.confirmPassword.run(req);
    
    // We expect there to be errors.
    expect(validationResult.isEmpty()).toBe(false);
  })
})

describe("fullName validation", () => {
  test("should pass for a valid fullNames", async () => {

    const validFullNames = [
      'John',
      'Mary Johns0n',
      'Alice Will1ams',
      'Bob_Brown',
      'Emma Jone#s',
      'DB. Scooper',
    ]
    const req: any = {
      body: {}
    }

    for (const fullName of validFullNames) {
      req.body.fullName = fullName;
      const validationResult = await userValidators.fullName.run(req);

      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for fullName: ${fullName}`);
      }

      // Expecting no errors since these should be valid names
      expect(validationResult.isEmpty()).toBe(true);
    }
  })

  test("should fail for invalid fullNames", async () => {
    const invalidFullNames = [
      "",    // empty string
      null,  // null
      "   ", // purely white space
      "a".repeat(65) // string length 65 character, when max is 64.
    ]

    const req: any = {
      body: {}
    }

    for (const fullName of invalidFullNames) {
      req.body.fullName = fullName;
      const validationResult = await userValidators.fullName.run(req);

      // If our validator didn't catch errors for the invalid name, log it.
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for fullName: ${fullName}`);
      }

      // Expecting errors since these are invalid fullNames
      expect(validationResult.isEmpty()).toBe(false);
    }
  })
})

describe("role validation", () => {
  
  test("should pass for valid roles", async () => {

    const validRoles = Object.values(mockRoles)
    const req: any = {
      body: {}
    };

    for (const role of validRoles) {
      req.body.role = role;
      const validationResult = await userValidators.role.run(req);

      // If validator caught an error, log it
      if (!validationResult.isEmpty()) {
        console.log(`Validation failed for role: ${role}`);
      }

      // Expecting no errors since these should be valid roles
      expect(validationResult.isEmpty()).toBe(true);
    }
  });

  test("should fail for invalid roles", async () => {
    const validRoles = [
      "",     // empty string
      null,   // null
      0,      // valid roles are from 1-5
      10,     // valid roles are from 1-5
      "some-random-string", // not a value in the roles_map
    ];
    const req: any = {
        body: {}
      };

    for (const role of validRoles) {
      req.body.role = role;
      const validationResult = await userValidators.role.run(req);

      // If validator didn't catch an error with the invalid role, log it
      if (validationResult.isEmpty()) {
        console.log(`Validation passed for role: ${role}`);
      }

      // Expecting errors since we think these roles are invalid
      expect(validationResult.isEmpty()).toBe(false);
    }
  });
});