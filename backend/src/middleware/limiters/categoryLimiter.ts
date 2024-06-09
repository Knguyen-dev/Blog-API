import rateLimit from "express-rate-limit";
import createRateLimitHandler from "./rateLimitHandler";

/*
- Creating, updating, and deleting categories should happen sparingly in the application
in general, unlike how we mess with tags. So the amount of requests allowed should be small.

*/
export const updateCategoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  handler: createRateLimitHandler("Too many requests to update categories from this IP! Please ensure you are only updating categories when necessary and avoid excessive updates.")
});

export const deleteCategoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  handler: createRateLimitHandler("Too many requests to delete categories from this IP! Please ensure you are only deleting categories when necessary and avoid excessive deletions.")
});

export const createCategoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  handler: createRateLimitHandler("Too many requests to create categories from this IP! Please ensure you are only creating categories when necessary and avoid excessive creations.")
});
