const verifyRoles = require("../../middleware/verifyRoles");

describe("verifyRoles middleware", () => {  
  // call next if user role is included in the allowed roles
  test("call next when role is included in allowed roles", () => {

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
    const next = jest.fn();

    for (const scenario of scenarios) {
      const req = scenario.req;
      const middleware = verifyRoles(...scenario.allowedRoles);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();

      // Clear the jest mock before the next test
      next.mockClear()
    }    
  })
  
  test("throw error when role isn't included in allowed roles", () => {
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
    const next = jest.fn();
     for (const scenario of scenarios) {
      const req = scenario.req;
      const middleware = verifyRoles(...scenario.allowedRoles);
      expect(() => middleware(req, res, next)).toThrow();
      expect(() => middleware(req, res, next)).toThrow(expect.objectContaining({
        statusCode: 401
      }));    
    }    
  })

  test("throw unauthorized error when role isn't defined", () => {
    const req = {user: {stuff: 1}};
    const res = {}
    const next = jest.fn();
    const middleware = verifyRoles("user", "editor");
    expect(() => middleware(req, res, next)).toThrow();    

    expect(() => middleware(req, res, next)).toThrow(expect.objectContaining({
      statusCode: 401
    }));    
  })

  test("throw error when user isn't defined", () => {
    const req = {};
    const res = {}
    const next = jest.fn();
    const middleware = verifyRoles("user", "editor");
    expect(() => middleware(req, res, next)).toThrow();    

    expect(() => middleware(req, res, next)).toThrow(expect.objectContaining({
      statusCode: 401
    }));    
  })
})





