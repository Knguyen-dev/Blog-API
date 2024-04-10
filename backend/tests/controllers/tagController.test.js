// Mock the roles being used 
jest.mock("../../config/roles_map", () => ({
  user: "USER",
  editor: "EDITOR",
  admin: "ADMIN"
}))



// mock 
const app = require("../../app");
const request = require("supertest");
const tokenUtils = require("../../middleware/tokenUtils");
const {Tag, tagEvents} = require("../../models/Tag")
const roles_map = require("../../config/roles_map");
const dbUtils = require("../../middleware/dbUtils");
const Post = require("../../models/Post")


const user = {
  id: "some-id",
  role: roles_map.user
}
const userJWT = tokenUtils.generateAccessToken(user);

const editor = {
  id: "some-id",
  role: roles_map.editor
}
const editorJWT = tokenUtils.generateAccessToken(editor);


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

  test("should respond 400 for validation errors", async() => {

    const requestBody = {
      title: ""
    }

    const findOneSpy = jest.spyOn(Tag, "findOne").mockImplementation();

    const res = await request(app)
      .post("/tags")
      .send(requestBody)
      .set("authorization", `Bearer ${editorJWT}`);

    
    /*
    - We expected it to fail at handleValidationErrors, which means our Tag.findOne
      should not have even gotten the chance to be called. So we know that our status 
      code 400 was caused by validation errors.
    */
    expect(findOneSpy).not.toHaveBeenCalled();
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

describe("tagEvents", () => {
   test("should emit and catch 'tagDeleted' event", async () => {
    const emitSpy = jest.spyOn(tagEvents, "emit");

    // Ensure it's a mock implementation so to replace original implementation of updateMany function
    const updateManySpy = jest.spyOn(Post, "updateMany").mockImplementation();

    // Simulate the deletion of a tag
    const deletedTagID = "deleted-tag-id";
    tagEvents.emit("tagDeleted", deletedTagID);

    // Expect the emit method to have been called with the correct event name and payload
    expect(emitSpy).toHaveBeenCalledWith("tagDeleted", deletedTagID);

    // Expect the updateMany method to have been called with the correct parameters
    expect(updateManySpy).toHaveBeenCalledWith(
        { tags: deletedTagID },
        { $pull: { tags: deletedTagID } }
    );
  });
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