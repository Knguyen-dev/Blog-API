
const mockRoles = {
  admin: "ADMIN",
  editor: "EDITOR",
  user: "USER"
}

jest.mock("../../../config/roles_map", () => (mockRoles));

const userPerms = require("../../../middleware/permissions/userPerms");

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
    };
    const res = {};
    const next = jest.fn();

    userPerms.canModifyUser(req, res, next);
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
    };
    const res = {};
    const next = jest.fn();

    userPerms.canModifyUser(req, res, next);
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
    };
    const res = {};
    const next = jest.fn();

    userPerms.canModifyUser(req, res, next);
    expect(next).toHaveBeenCalled();
  })

  test("should throw an error when user isn't an admin, and IDs don't match", () => {

    const req = {
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

    userPerms.canModifyUser(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  })
});