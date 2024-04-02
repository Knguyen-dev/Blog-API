const roleVerification = require("../../middleware/roleVerification");

describe("verifyRoles middleware", () => {  
  // call next if user role is included in the allowed roles
  test("call next with no error when role is included in allowed roles", () => {

    const scenarios = [
      {
        req: {user: {role: "admin"}},
        allowedRoles: ["admin", "editor"],
      },
      {
        req: {user: {role: "editor"}},
        allowedRoles: ["editor"],
      },
      {
        req: {user: {role: "user"}},
        allowedRoles: ["user", "editor", "admin"],
      }
    ];

    const res = {}
    for (const scenario of scenarios) {
      const req = scenario.req;
      const next = jest.fn();

      const middleware = roleVerification.verifyRoles(...scenario.allowedRoles);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    }    
  })
  
  test("call next(err) when role isn't included in allowed roles", () => {
    const scenarios = [
      {
        req: {user: {role: "admin"}},
        allowedRoles: ["editor"],
      },
      {
        req: {user: {role: "user"}},
        allowedRoles: ["editor", "admin"],
      },
      {
        req: {user: {role: "editor"}},
        allowedRoles: ["admin"],
      }
    ];

    const res = {}
    
     for (const scenario of scenarios) {
      const req = scenario.req;
      const next = jest.fn();

      const middleware = roleVerification.verifyRoles(...scenario.allowedRoles);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    }    
  })

  test("should call next(err) unauthorized error when role isn't defined", () => {
    const req = {user: {stuff: 1}};
    const res = {}
    const next = jest.fn();
    const middleware = roleVerification.verifyRoles("user", "editor");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    
  })

  
  test("should call next(err) when user isn't defined", () => {
    const req = {};
    const res = {}
    const next = jest.fn();
    const middleware = roleVerification.verifyRoles("user", "editor");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  })
})





