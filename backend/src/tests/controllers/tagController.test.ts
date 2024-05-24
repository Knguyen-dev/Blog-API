import { describe, test, expect, jest } from "@jest/globals";

// Mock the roles being used 
const mockRoles = {
  user: 1,
  editor: 2,
  admin: 3
}

jest.mock("../../config/roles_map", () => ({
  roles_map: mockRoles
}))



// mock 
import app from "../../app";
import request from "supertest";
import * as tokenUtils from "../../middleware/tokenUtils"
import Tag from "../../models/Tag"
import { IUserDoc } from "../../types/User";


const user = {
  id: "some-id",
  role: mockRoles.user
};
const userJWT = tokenUtils.generateAccessToken(user as IUserDoc);

const editor = {
  id: "some-id",
  role: mockRoles.editor
}
const editorJWT = tokenUtils.generateAccessToken(editor as IUserDoc);


describe("POST /tags", () => {
  test("should respond 401 if requestor isn't an editor or admin", async () => {

    const res = await request(app)
     .post("/tags")
     .send()
     .set("authorization", `Bearer ${userJWT}`)
     
    expect(res.body.error.message).toBe("Unauthorized to access this resource!");
    expect(res.status).toBe(401);
    
  });

  test("should respond 400 if a tag already exists with a given title", async() => {
    // Simulating that they did find a tag with that title
    const findOneSpy = jest.spyOn(Tag, "findOne").mockResolvedValue(true);

    const requestBody = {title: "SomeTitle"}
    const res = await request(app)
     .post("/tags")
     .send(requestBody)
     .set("authorization", `Bearer ${editorJWT}`)
    
    /*
    - Expect the database function to have been called indicating that we 
      passed syntax validation and whatnot.

    - NOTE: If this wasn't called, then the test failed at handleValidationErrors, 
      which means the data in requestBody isn't up to code with our validation constraints
    */
    expect(findOneSpy).toHaveBeenCalled();
    expect(res.status).toBe(400);
  })
})

describe("DELETE /tag/:id", () => {
  test("should respond 401 if requestor isn't an editor or admin", async () => {
    const res = await request(app)
     .delete("/tags/1")
     .set("authorization", `Bearer ${userJWT}`)
     
    expect(res.body.error.message).toBe("Unauthorized to access this resource!");
    expect(res.status).toBe(401);
  });

  test("should respond 404 when tag isn't found", async() => {
    const invalidID = "some-invalid-id";
    const res = await request(app)
     .delete(`/tags/${invalidID}`)
     .set("authorization", `Bearer ${editorJWT}`);

    expect(res.body.error.message).toBe("Tag not found!");
    expect(res.status).toBe(404);
  })
})


describe("GET /tags/:id", () => {

  test("should return 404 when tag ID isn't found", async () => {
    const invalidID = "some-invalid-id";
    const res = await request(app)
      .get(`/tags/${invalidID}`)
      .set("authorization", `Bearer ${editorJWT}`);

    /*
    NOTE: Asserting the error message first, so in case the test fails 
      we get to see the error message. For example if we got a 404
      route not found, we'd very quickly know and adjust the route.
    */
    expect(res.body.error.message).toBe("Tag wasn't found!");
    expect(res.status).toBe(404);

  })
})