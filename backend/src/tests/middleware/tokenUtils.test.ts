import { describe, it, expect, jest } from "@jest/globals";
import { IUserDoc } from "../../types/User";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "../../middleware/tokenUtils";

// Mocking environment variables
process.env.ACCESS_TOKEN_SECRET = "testAccessTokenSecret";
process.env.REFRESH_TOKEN_SECRET = "testRefreshTokenSecret";


describe("generateAccessToken", () => {
  it("should generate an access token", () => {
    const user: Partial<IUserDoc> = { id: "testUserId", role: 1 };
    const accessToken = generateAccessToken(user as IUserDoc);
    expect(accessToken).toBeDefined();
  });
});

describe("generateRefreshToken", () => {
  it("should generate a refresh token", () => {
    const user: Partial<IUserDoc> = { id: "testUserId" };
    const refreshToken = generateRefreshToken(user as IUserDoc);
    expect(refreshToken).toBeDefined();
  });
});

describe("setRefreshTokenCookie", () => {
  it("should set a refresh token cookie", () => {
    const res = {
      cookie: jest.fn(),
    } as any;
    setRefreshTokenCookie(res, "testRefreshToken");
    expect(res.cookie).toHaveBeenCalledWith("jwt", "testRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
  });
});
