/*
+ Partial utility type
By using the partial utility type, we can mock only the parts of the Request object
that we need for our tests.





*/


import {describe, expect, jest, test} from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import verifyCredentials from "../../middleware/verifyCredentials";

describe("verifyCredentials middleware", () => {
  test("set credentials headers when request origin is included in allowed origin", () => {
    const scenarios = [

      /*
      Partial<T> allows us to create objects with all of the properties of 'T' set to 
      optional. 
      
      1. So here the mock request objects are set to Partial<Request> to avoid 
      type errors, and makes all properties of the real Request object optional. As a result 
      we don't need to mock the entire Request Object.
      
      2. Then we cast it as 'Request' when passing it to the middleware funciton. This ensures 
      that the middleware function receives the object in the expected type ('Request'), even 
      when we've only provided a small subset of its real properties. 
      
      */
      {
        req: { headers: { origin: "http://localhost:8080" } } as Partial<Request>,
        allowedOrigins: ["http://localhost:8080", "http://localhost:3293"]
      },
      {
        req: { headers: { origin: "http://localhost:2000" } } as Partial<Request>,
        allowedOrigins: ["http://localhost:2000"]
      },
      {
        req: { headers: { origin: "www.myapi.com" } } as Partial<Request>,
        allowedOrigins: ["www.myapi.com", "www.myapi.net"]
      },
    ]

    scenarios.forEach(scenario => {
      const req = scenario.req as Request;
      const res = {
        header: jest.fn()
      } as Partial<Response>;
      const next = jest.fn() as NextFunction;
      const allowedOrigins = scenario.allowedOrigins;

      const middleware = verifyCredentials(allowedOrigins);

      // When using in middleware we need to have proper types instead of partial
      middleware(req, res as Response, next);

      expect(res.header).toHaveBeenCalledWith("Access-Control-Allow-Credentials", "true");
      expect(next).toHaveBeenCalled();
    });
  });

  test("don't set credentials headers when request origin isn't included in allowed origins", () => {
    const scenarios = [
      {
        req: { headers: { origin: "http://www.toptech.com" } } as Partial<Request>,
        allowedOrigins: ["http://www.agnes.com", "http://www.blameUs.com"]
      },
      {
        req: { headers: { origin: "http://thefirstweb.com" } } as Partial<Request>,
        allowedOrigins: ["http://thelastweb.com"]
      },
      {
        req: { headers: { origin: "https://www.myapi.com" } } as Partial<Request>,
        allowedOrigins: ["https://www.oceaniaFisheries.net", "https://www.doubleCrossed.net"]
      },
    ]

    scenarios.forEach(scenario => {
      const req = scenario.req as Request;
      const res = {
        header: jest.fn()
      } as Partial<Response>;
      const next = jest.fn() as NextFunction;
      const allowedOrigins = scenario.allowedOrigins;

      const middleware = verifyCredentials(allowedOrigins);

      middleware(req, res as Response, next);

      expect(res.header).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
