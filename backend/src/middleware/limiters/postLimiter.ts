import rateLimit from "express-rate-limit";
import createRateLimitHandler from "./rateLimitHandler";

export const postLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 15,
  handler: createRateLimitHandler("Too many requests for posts, categories, and or tags.")
})



