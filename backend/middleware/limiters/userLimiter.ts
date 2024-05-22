import rateLimit from "express-rate-limit";
import { createError } from "../errorUtils";
export const editUserLimiter = rateLimit({
  windowMs: 30 * 1000, // A thirty second window,
  max: 10, // maximum of 10 requests per minute
  handler: (req, res, next, options) => {
    const err = createError(429, `Too many account editing attempts. Please try again in ${options.windowMs / 1000} seconds`);
    next(err);
  }
})


