const errorUtils = require("../../middleware/errorUtils");

describe("createError", () => {
  test("error object should contain message and status", () => {
    const error = errorUtils.createError(400, "Bad Request");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad Request");
  })

  test("if no message is given, error message should be a concatenation of all messages in data[]", () => {

    const errorData = [
      {
        message: "Bad Request"
      },
      {
        message: "Bad Request 2"
      }
    ]

    const error = errorUtils.createError(400, "", errorData);


    // Assert hte error message creation process was successful
    expect(error.message).toBe(errorUtils.createErrorMessage(errorData));
  })
})
