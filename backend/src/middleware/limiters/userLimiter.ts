import rateLimit from "express-rate-limit";
import createRateLimitHandler from "./rateLimitHandler";

export const editUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 5, // maximum of 5 per window
  handler: createRateLimitHandler("Too many account editing attempts for this IP!")
})