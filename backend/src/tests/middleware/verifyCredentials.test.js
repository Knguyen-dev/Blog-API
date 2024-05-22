const verifyCredentials = require("../../middleware/verifyCredentials");


describe("verifyCredentials middleware", () => {
  // if origin is in the allowed origin's list, set credentials headers
  test("set credentials headers when request origin is included in allowed origin", () => {
    const scenarios = [
      {
        req: {headers: {origin: "http://localhost:8080"}},
        allowedOrigins: ["http://localhost:8080", "http://localhost:3293"]
      },
      {
        req: {headers: {origin: "http://localhost:2000"}},
        allowedOrigins: ["http://localhost:2000"]
      },
      {
        req: {headers: {origin: "www.myapi.com"}},
        allowedOrigins: ["www.myapi.com", "www.myapi.net"]
      },
    ]

    scenarios.forEach(scenario => {
      const req = scenario.req;
      const res = {
        header: jest.fn()
      };
      const next = jest.fn();
      const allowedOrigins = scenario.allowedOrigins;

      const middleware = verifyCredentials(allowedOrigins);

      middleware(req, res, next);

      // Expect header function to be called to have the origins set
      expect(res.header).toHaveBeenCalledWith("Access-Control-Allow-Credentials", true);

      // Expect the next function to be called 
      expect(next).toHaveBeenCalled()
    });
  });

  // should not set credentials headers if it isn't from an allowed origin.
  test("don't set credentials headers when request origin isn't included in allowed origins", () => {

    const scenarios = [
      {
        req: {headers: {origin: "http://www.toptech.com"}},
        allowedOrigins: ["http://www.agnes.com", "http://www.blameUs.com"]
      },
      {
        req: {headers: {origin: "http://thefirstweb.com"}},
        allowedOrigins: ["http://thelastweb.com"]
      },
      {
        req: {headers: {origin: "https://www.myapi.com"}},
        allowedOrigins: ["https://www.oceaniaFisheries.net", "https://www.doubleCrossed.net"]
      },
    ]

    scenarios.forEach(scenario => {

      const req = scenario.req;
      const res = {
        header: jest.fn()
      };
      const next = jest.fn();
      const allowedOrigins = scenario.allowedOrigins;
      
      const middleware = verifyCredentials(allowedOrigins);

      middleware(req, res, next);

      // Expect that the header function wasn't called
      expect(res.header).not.toHaveBeenCalled();

      // Expect the next function to be called 
      expect(next).toHaveBeenCalled()
    })
  })
});