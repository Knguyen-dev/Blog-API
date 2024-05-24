import { describe, test, expect, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
const mockRoles = {
  admin: "ADMIN",
  editor: "EDITOR",
  user: "USER"
}

jest.mock("../../../config/roles_map", () => ({roles_map: mockRoles}));

import { canModifyUser } from "../../../middleware/permissions/userPerms";


describe("canModifyUser", () => {
  test("should call next when requestor is an admin AND IDs don't match", () => {

    const req = {
      user: {
        role: mockRoles.admin,
        id: "some-id-1",
      },
      params: {
        id: 'some-id-2'
      }
    } as any;
    const res = {} as Response;
    const next = jest.fn();

    canModifyUser(req, res, next as NextFunction);
    expect(next).toHaveBeenCalled();
  });

  // should call next when admin and IDs match
  test("should call next when admin and IDs match", () => {
    const req = {
      user: {
        role: mockRoles.admin,
        id: "some-id-1",
      },
      params: {
        id: "some-id-1",
      }
    } as any;
    const res = {};
    const next = jest.fn();

    canModifyUser(req, res as Response, next);
    expect(next).toHaveBeenCalled();
  })

  // when id's 
  test("should call next when IDs simply and user isn't admin", () => {
    const req = {
      user: {
        role: mockRoles.editor,
        id: "some-id-1",
      },
      params: {
        id: "some-id-1",
      }
    } as any;
    const res = {};
    const next = jest.fn();

    canModifyUser(req, res as Response, next);
    expect(next).toHaveBeenCalled();
  })

  test("should throw an error when user isn't an admin, and IDs don't match", () => {

    const req: any = {
      user: {
        role: mockRoles.editor,
        id: "some-id-1",
      },
      params: {
        id: "some-id-2"
      }
    };
    const res = {};
    const next = jest.fn();

    canModifyUser(req, res as Response, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  })
});