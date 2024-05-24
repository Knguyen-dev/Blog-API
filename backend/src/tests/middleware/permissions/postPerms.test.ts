import { describe, test, expect, jest } from "@jest/globals";
const mockRoles = {
  user: 1,
  editor: 2,
  admin: 3,
}
jest.mock("../../../config/roles_map", () => ({roles_map: mockRoles}));



import { canUpdatePost, canDeletePost, canViewPost } from "../../../middleware/permissions/postPerms";
import CustomError from "../../../config/CustomError";

describe("canUpdatePost middleware", () => {

  test("should throw an error when userId and postUserId don't match", () => {
    const userId = "123";
    const postUserId = "456";
    expect(() => canUpdatePost(userId, postUserId)).toThrow(expect.objectContaining({
      statusCode: 403,
      message: "Cannot update post since you didn't create this post!",
    }));
  })

  test("shouldn't throw an error when userId and postUserId match", () => {
    const userId = "123";
    const postUserId = userId;
    expect(() => canUpdatePost(userId, postUserId)).not.toThrow(CustomError);
  })


})

describe("canDeletePost middleware", () => {
  test("should throw error when userId and postUserId don't match and the user isn't an admin", () => {
    const userId = "123";
    const postUserId = "456";
    expect(() => canDeletePost(userId, mockRoles.editor, postUserId)).toThrow(expect.objectContaining({
      statusCode: 403,
      message: "Cannot delete post since you don't have the authority!",
    }));

  })

  test("shouldn't throw error when userId and postUserId match", () => {
    const userId = "123";
    const postUserId = userId;
    expect(() => canDeletePost(userId, mockRoles.editor, postUserId)).not.toThrow(CustomError);
  })

  test("shouldn't throw an error when the user is an admin", () => {
    const userId = "123";
    const postUserId = "456";
    expect(() => canDeletePost(userId, mockRoles.admin, postUserId)).not.toThrow(CustomError);
  })
})

describe("canViewPost middleware", () => {
  test("should throw error when userId and postUserId don't match and the user isn't an admin", () => {
    const userId = "123";
    const postUserId = "456";
    expect(() => canViewPost(userId, mockRoles.editor, postUserId)).toThrow(expect.objectContaining({
      statusCode: 401,
      message: "Not authorized to view this post!",
    }));

  })

  test("shouldn't throw error when userId and postUserId match", () => {
    const userId = "123";
    const postUserId = userId;
    expect(() => canViewPost(userId, mockRoles.editor, postUserId)).not.toThrow(CustomError);
  })

  test("shouldn't throw an error when the user is an admin", () => {
    const userId = "123";
    const postUserId = "456";
    expect(() => canViewPost(userId, mockRoles.admin, postUserId)).not.toThrow(CustomError);
  })
})