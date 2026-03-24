/**
 * Rate limiting configuration
 * Protects against DOS attacks and prevents cost explosion
 */

import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient, isRedisAvailable } from './redis';

// Rate limit window in milliseconds (5 minutes)
const WINDOW_MS = 5 * 60 * 1000;

// Standard rate limits
const LIMITS = {
  // General API requests (non-AI)
  GENERAL: {
    windowMs: WINDOW_MS,
    max: 100, // 100 requests per 5 minutes per IP
    message: 'Too many requests from this IP, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  },
  // AI-powered endpoints (most expensive)
  AI_OPERATIONS: {
    windowMs: WINDOW_MS,
    max: 10, // 10 AI calls per 5 minutes per IP
    message: 'Too many AI requests from this IP, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  },
  // Upload endpoints
  UPLOADS: {
    windowMs: WINDOW_MS,
    max: 20, // 20 uploads per 5 minutes per IP
    message: 'Too many upload requests from this IP, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  },
};

/**
 * Create a rate limiter with optional Redis store
 * Falls back to in-memory store if Redis unavailable
 */
function createRateLimiter(config: typeof LIMITS.GENERAL) {
  const options: any = { ...config };

  // Use Redis store if available (for distributed rate limiting)
  if (isRedisAvailable()) {
    const redisClient = getRedisClient();
    if (redisClient) {
      options.store = new RedisStore({
        // @ts-expect-error - RedisStore expects a different client type
        client: redisClient,
        prefix: 'rate-limit:',
      });
      console.log('✅ Rate limiting: Using Redis store (distributed)');
    }
  } else {
    console.log('⚠️  Rate limiting: Using in-memory store (single server only)');
  }

  return rateLimit(options);
}

/**
 * General API rate limiter
 * Applied to all non-AI endpoints
 */
export const generalRateLimiter = createRateLimiter(LIMITS.GENERAL);

/**
 * AI operations rate limiter
 * Applied to expensive AI-powered endpoints
 * - /api/analysis/fit-score
 * - /api/analysis/bullets
 * - /api/analysis/cover-letter
 * - /api/analysis/interview-prep
 */
export const aiRateLimiter = createRateLimiter(LIMITS.AI_OPERATIONS);

/**
 * Upload rate limiter
 * Applied to file upload endpoints
 * - /api/resume/upload
 */
export const uploadRateLimiter = createRateLimiter(LIMITS.UPLOADS);

/**
 * Get rate limit status for an IP
 * Returns remaining requests and reset time
 */
export function getRateLimitStatus(req: any): {
  limit: number;
  remaining: number;
  resetTime: Date | null;
} {
  return {
    limit: req.rateLimit?.limit || 0,
    remaining: req.rateLimit?.remaining || 0,
    resetTime: req.rateLimit?.resetTime
      ? new Date(req.rateLimit.resetTime)
      : null,
  };
}
