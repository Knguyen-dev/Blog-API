import rateLimit from "express-rate-limit";
import createRateLimitHandler from "./rateLimitHandler";

export const createTagLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, 
  handler: createRateLimitHandler("Too many tag creation requests from this IP!")
})

export const updateTagLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, 
  handler: createRateLimitHandler("Too many tag update requests from this IP!")
})

export const deleteTagLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, 
  handler: createRateLimitHandler("Too many tag deletion requests from this IP!")
})