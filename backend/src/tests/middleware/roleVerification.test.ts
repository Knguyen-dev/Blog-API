import { Request, Response } from "express";
import { describe, test, expect, jest } from "@jest/globals";
import {
  verifyRoles,
} from "../../middleware/roleVerification";


describe("verifyRoles middleware", () => {  
  // call next if user role is included in the allowed roles
  test("call next with no error when role is included in allowed roles", () => {

    const scenarios = [
      {
        req: {user: {role: 1}}, // admin
        allowedRoles: [1, 2], // admin, editor
      },
      {
        req: {user: {role: 2}}, // editor
        allowedRoles: [2], // editor
      },
      {
        req: {user: {role: 3}}, // user
        allowedRoles: [1, 2, 3], // user, editor, admin
      }
    ];


    const res = {} as Response;
    for (const scenario of scenarios) {
      const req = scenario.req as Request;
      const next = jest.fn();

      const middleware = verifyRoles(...scenario.allowedRoles);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    }    
  })
  
  test("call next(err) when role isn't included in allowed roles", () => {
    const scenarios = [
      {
        req: {user: {role: 1}}, // admin
        allowedRoles: [2], // editor
      },
      {
        req: {user: {role: 3}}, // user
        allowedRoles: [2, 1], // editor, admin
      },
      {
        req: {user: {role: 2}}, // editor
        allowedRoles: [1], // admin
      }
    ];

    const res = {} as Response;
    
     for (const scenario of scenarios) {
      const req = scenario.req as Request;
      const next = jest.fn();

      const middleware = verifyRoles(...scenario.allowedRoles);

      middleware(req, res, next);

      // Expecting an error object, with property statusCode = 401
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        })
      )
    }    
  })

  test("should call next(err) unauthorized error when role isn't defined", () => {
    const req = {user: {role: 1}} as Request; // user
    const res = {} as Response;
    const next = jest.fn();
    const middleware = verifyRoles(2, 3); // editor, admin


    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    // Expecting an error object, with property statusCode = 401
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    )
    
  })
  
  test("should call next(err) when user isn't defined", () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();
    const middleware = verifyRoles(1, 2); // user and editor

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    // Expecting an error object, with property statusCode = 401
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    )
  })
})