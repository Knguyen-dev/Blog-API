import rateLimit from "express-rate-limit";
import createRateLimitHandler from "./rateLimitHandler";


/*
- Standard Headers:
When set to ture this includes rate limit information in the response headers using the 'RateLImit-*' headers defined by a standard called 'IETF

1. 'RateLimit-Limit': Max number of requests the user is allowed to make in a time window
2. 'RateLimt-Remaining': Number of requests remaining in current time window that the user can make
3. 'RateLimit-Reset': The time (in UTC epoch seconds) at which the rate limit will reset


- Legacy Headers: Includes rate limit information in the response headers using older non-standard headers.

1. X-RateLimit-Limit: The maximum number of requests that the user is allowed to make in the current time window.
2. X-RateLimit-Remaining: The number of requests remaining in the current time window.
3. X-RateLimit-Reset: The time (in UTC epoch seconds) at which the rate limit will reset.

+ Methodology:
Here we encourage the use of the standardized and more modern headers. Here the idea behind this is
that each limiter will hvae a handler that creates its own 'error message'. Then pass that 
error message to 'createRateLimitHandler' which will add the time until the rate limit window 
resets. Then we send that to our global error handler
*/

// Limit repeated login attempts
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: createRateLimitHandler("Too many login attempts from this IP!")
});

// Limit repeated sign-up attempts
export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 signup requests per `window` (here, per hour)
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler("Too many signup attempts from this IP!")
});

// Limit repeated forgot password requests
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 forgot password requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler("Too many forgot password requests from this IP!")
});

// Limit repeated forgot username requests
export const forgotUsernameLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1, // Limit each IP to 3 forgot username requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler("Too many forgot username requests from this IP!")
});

// Limit repeated password reset requests
export const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 password reset requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler("Too many password reset requests from this IP!")
});

// Limit repeated email verification requests
export const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2, // Limit each IP to 3 email verification requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler("Too many email verification requests from this IP!")
});