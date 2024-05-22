import rateLimit from "express-rate-limit";
import { createError } from "../errorUtils";
export const postLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 15,
  handler: (req, res, next, options) => {
    const err = createError(429, `Too many requests for posts, categories, and or tags. Please try again in ${options.windowMs / 1000} seconds`)
    next(err); 
  }
})



