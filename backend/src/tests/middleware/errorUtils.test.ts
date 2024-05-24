import { describe, test, expect } from "@jest/globals";
import { createError, createErrorMessage } from "../../middleware/errorUtils";


describe("createError", () => {
  test("error object should contain message and status", () => {
    const error = createError(400, "Bad Request");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad Request");
  })

  test("if no message is given, error message should be a concatenation of all messages in data[]", () => {

    const errorData = [
      {
        field: "Field 1",
        message: "Bad Request"
      },
      {
        field: "Another field",
        message: "Bad Request 2"
      }
    ]

    const error = createError(400, "", errorData);

    // Assert the error message creation process was successful
    expect(error.message).toBe(createErrorMessage(errorData));
    expect(error.statusCode).toBe(400);
    
    // Assert that the error.details matches the errorData array
    expect(error.details).toEqual(errorData);
  })
})
