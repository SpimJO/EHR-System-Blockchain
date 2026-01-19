/**
 * Rate Limiter Middleware
 * ----------------------
 * Basic rate limiting using memory store.
 */
import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Only apply rate limiting in production environment
 */
export const shouldRateLimit = (_req: Request, _res: Response): boolean => {
    if (process.env.NODE_ENV !== 'production') {
        return false;
    }
    return true;
};

/**
 * Standard rate limiter options
 */
export const standardRateLimiterOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    },
    skip: (req: Request, res: Response) => !shouldRateLimit(req, res),
};

/**
 * Create global rate limiter
 */
export const createRateLimiterMiddleware = async () => {
    return rateLimit(standardRateLimiterOptions);
};

export const basicRateLimiterMiddleware = rateLimit(standardRateLimiterOptions);

/**
 * Auth rate limiter options
 */
export const authRateLimiterOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many login attempts, please try again later.',
    },
    skip: (_req: Request) => process.env.NODE_ENV !== 'production',
};

/**
 * Create auth rate limiter
 */
export const createAuthRateLimiterMiddleware = async () => {
    return rateLimit(authRateLimiterOptions);
};
