
/*
- Create a custom implementation for verify function of the 'jsonwebtoken'
  module. So subsequent imports of jsonwebtoken will use this mock function
  for this file. Remember that 'callback' here is the 'async (err, user)' function
  that's defined in the real verifyJWT, and we're passing in err and user to it.

- NOTE: This is why we mock the import first, and then we import verifyJWT after
  so that verifyJWT will use the mock when we run it from this file.
*/
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn((token, secret, callback) => {
    if (token === "valid-access-token") {

      // If access token is valid, we call the callback with this, which will
      // indicate error was null and user as the payload or user.
      const user = {id: 1, username: "testUser"};
      callback(null, user);
    } else {
      callback(new Error("Invalid token"));
    }
  })
}))

const verifyJWT = require("../../middleware/verifyJWT");






describe("verifyJWT middleware", () => {
  
  test("should call next(error) if authorization header isn't defined", () => {
    const req = {
      headers: {}
    }
    const res = {}
    const next = jest.fn();

    verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  })
  
  test("should call next(error) when no access token in authorization header", () => {
    const req = {
      headers: {
        authorization: ""
      }
    }
    const res = {}
    const next = jest.fn();

    verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  })

  test("should call error when there's an invalid access token in authorization header", () => {
    const req = {
      headers: {
        // An invalid access token
        authorization: "Bearer invalid-access-token"
      }
    }
    const res = {}
    const next = jest.fn();

    verifyJWT(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  })

  test("should call next() with no error when access token is valid. Also should define user", () =>{

    const req = {
      headers: {
        authorization: "Bearer valid-access-token"
      }
    }
    const res = {}
    const next = jest.fn();


    verifyJWT(req, res, next);

    // Assert that next was called with no arguments, meaning no errors were sent with it
    expect(next).toHaveBeenCalledWith();

    // Assert that user is defined and it matches our user we defined above
    expect(req.user).toEqual({id: 1, username: "testUser"});
  });


})