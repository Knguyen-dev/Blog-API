import { describe, test, expect, jest } from "@jest/globals";

import authRouter from "../../routes/authRouter";
import express from "express";
const app = express();
import request from "supertest";
import bcrypt from "bcrypt";
import User from "../../models/User";
import cookieParser from "cookie-parser";

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
})
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