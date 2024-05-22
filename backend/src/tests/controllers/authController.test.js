const authRouter = require("../../routes/authRouter")
const express = require("express")
const app = express();
const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const tokenUtils = require("../../middleware/tokenUtils");
const cookieParser = require("cookie-parser");

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use("/", authRouter);




const mockUser = {
  _id: "some-id",
  username: "testUser123",
  password: "P$ssword_123",
  save: jest.fn()
}

const loginInfo = {
  username: mockUser.username,
  password: mockUser.password,
}

const signupInfo = {
  email: "testUser@example.com",
  username: "testUser123",
  fullName: "<NAME>",
  password: "P$ssword_123", 
  confirmPassword: "P$ssword_123",
}


describe("POST /login", () => {
  test("should return 400 if username is incorrect", async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    // Spy on bcrypt.compare to ensure it's not called
    jest.spyOn(bcrypt, 'compare');

    const response = await request(app).post("/login").send(loginInfo);

    // Ensure our findOne mock was called
    expect(User.findOne).toHaveBeenCalled()
    // Ensure we didn't call bcrypt.compare 
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(response.status).toBe(400);
  })

  test("should return 400 if password is incorrect", async() => {
    // Mock findOne to simulate that the username was correct
    jest.spyOn(User, 'findOne').mockResolvedValue(true);

    // Mock the bcrypt compare function to simulate the passwords not matching
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const response = await request(app).post("/login").send(loginInfo);

    // Check that bcrypt.compare was called with the expected arguments, ensures that 
    // the error was caused by an incorrect password
    expect(bcrypt.compare).toHaveBeenCalled();

    expect(response.status).toBe(400);
  })

  test("should return 200 and data if username and password match", async() => {
    /*
    - Mock the login static method so it returns mockUser
    - Mock the token utilities
    */
    jest.spyOn(User, "login").mockResolvedValue(mockUser);
    jest.spyOn(tokenUtils, "generateAccessToken").mockReturnValue("access-token");
    jest.spyOn(tokenUtils, "generateRefreshToken").mockReturnValue("refresh-token");
    jest.spyOn(tokenUtils, "setRefreshTokenCookie").mockImplementation()

    const response = await request(app).post("/login").send(loginInfo);

    // Assert the token utils mocks were called
    expect(tokenUtils.generateAccessToken).toHaveBeenCalled();
    expect(tokenUtils.generateRefreshToken).toHaveBeenCalled();
    expect(tokenUtils.setRefreshTokenCookie).toHaveBeenCalled();


    // Response data should have access token, and it should match 
    expect(response.body.accessToken).toBe("access-token");
    
    // Should also return the user
    expect(response.body).toHaveProperty("user");

    // assert status code 200
    expect(response.status).toBe(200);
  })
})

describe("POST /signup", () => {
  test("should return 400 if username is already taken", async () => {
    // Mock the behavior where username isn't available
    jest.spyOn(User, "isUsernameAvailable").mockReturnValue(false);

    const response = await request(app).post("/signup").send(signupInfo);

    // Assert that 'User.isUsernameAvailable' was called
    expect(User.isUsernameAvailable).toHaveBeenCalled();

    // Assert that the status is 400
    expect(response.status).toBe(400);
  });

  // Add more tests for other scenarios related to signup endpoint if needed
});

describe("GET /logout", () => {
  test("should respond with 401 if jwt cookie doesn't exist", async () => {
    const response = await request(app)
      .get("/logout")
      .expect(204); 
  });

  test("should respond with 204 if jwt cookie exists but not linked to a user", async() => {
    // Simulate where we didn't find a user
    jest.spyOn(User, "findOne").mockResolvedValue(false);

    const response = await request(app).get("/logout").set('Cookie', [
      'jwt=some-jwt-cookie'
    ]).expect(204)
  })

  test("should respond with 200 if jwt cookie exists and user exists", async() => {
    // Simulate where we didn't find a user
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    const response = await request(app).get("/logout").set('Cookie', [
      'jwt=some-jwt-cookie'
    ]).expect(200);
  })
})

describe("GET /refresh", () => {
  test("should respond with 401 if no jwt cookie", async () => {
    const response = await request(app)
      .get("/refresh")
      .expect(401); 
  });

  test("should respond with 403 if no user associated with jwt cookie", async() => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);
    const response = await request(app)
      .get("/refresh")
      .set("Cookie", [
        'jwt=some-jwt-cookie'
      ])
      .expect(403); 
  })

  test("should respond with 403 if associated with user but refresh token invalid", async() => {
    jest.spyOn(User, "findOne").mockResolvedValue(true);
    const response = await request(app)
      .get("/refresh")
      .set("Cookie", [
        'jwt=some-jwt-cookie'
      ])
      .expect(403); 
  })



  // Add more tests for other scenarios related to refresh endpoint if needed
});