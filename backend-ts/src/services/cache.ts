/**
 * Caching service for AI responses
 * Implements Redis-backed caching with fallback to no-cache mode
 */

import crypto from 'crypto';
import { getRedisClient, isRedisAvailable } from '../config/redis';

// Cache TTL (Time To Live) - 24 hours
const DEFAULT_CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

// Cache key prefix for namespacing
const CACHE_KEY_PREFIX = 'cortex:ai:';

/**
 * Generate a consistent cache key from input parameters
 * Uses SHA256 hash of the input for deterministic keys
 */
export function generateCacheKey(operation: string, ...inputs: string[]): string {
  const combined = inputs.join('|||');
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  return `${CACHE_KEY_PREFIX}${operation}:${hash}`;
}

/**
 * Get cached AI response
 * Returns null if cache miss or Redis unavailable
 */
export async function getCachedResponse<T>(
  key: string
): Promise<T | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const redisClient = getRedisClient();
    if (!redisClient) return null;

    const cached = await redisClient.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    return null;
  } catch (error: any) {
    console.error('❌ Cache get error:', error.message);
    return null;
  }
}

/**
 * Cache AI response with TTL
 * Silently fails if Redis unavailable (caching is optional)
 */
export async function setCachedResponse<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }

  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const serialized = JSON.stringify(value);
    await redisClient.setEx(key, ttl, serialized);
  } catch (error: any) {
    console.error('❌ Cache set error:', error.message);
    // Don't throw - caching is optional
  }
}

/**
 * Clear all cached AI responses
 * Used for cache invalidation or maintenance
 */
export async function clearAICaches(): Promise<number> {
  if (!isRedisAvailable()) {
    return 0;
  }

  try {
    const redisClient = getRedisClient();
    if (!redisClient) return 0;

    // Use SCAN to find all keys with our prefix
    const keys: string[] = [];
    let cursor = '0';

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: `${CACHE_KEY_PREFIX}*`,
        COUNT: 100,
      });

      cursor = String(reply.cursor);
      keys.push(...reply.keys);
    } while (cursor !== '0');

    // Delete all found keys
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    console.log(`✅ Cleared ${keys.length} cached AI responses`);
    return keys.length;
  } catch (error: any) {
    console.error('❌ Cache clear error:', error.message);
    return 0;
  }
}

/**
 * Clear specific cache entry
 */
export async function clearCachedResponse(key: string): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }

  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    await redisClient.del(key);
  } catch (error: any) {
    console.error('❌ Cache delete error:', error.message);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  available: boolean;
  keyCount: number;
}> {
  if (!isRedisAvailable()) {
    return { available: false, keyCount: 0 };
  }

  try {
    const redisClient = getRedisClient();
    if (!redisClient) return { available: false, keyCount: 0 };

    // Count keys with our prefix
    const keys: string[] = [];
    let cursor = '0';

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: `${CACHE_KEY_PREFIX}*`,
        COUNT: 100,
      });

      cursor = String(reply.cursor);
      keys.push(...reply.keys);
    } while (cursor !== '0');

    return {
      available: true,
      keyCount: keys.length,
    };
  } catch (error: any) {
    console.error('❌ Cache stats error:', error.message);
    return { available: false, keyCount: 0 };
  }
}

/**
 * Wrapper function to add caching to any async AI operation
 * Usage: await withCache('operation', async () => aiCall(), input1, input2)
 */
export async function withCache<T>(
  operation: string,
  fn: () => Promise<T>,
  ...cacheKeyInputs: string[]
): Promise<T> {
  const cacheKey = generateCacheKey(operation, ...cacheKeyInputs);

  // Try to get from cache
  const cached = await getCachedResponse<T>(cacheKey);
  if (cached !== null) {
    console.log(`✅ Cache HIT for ${operation}`);
    return cached;
  }

  console.log(`⚠️  Cache MISS for ${operation} - calling AI`);

  // Execute the actual function
  const aiGenerationResult = await fn();

  // Cache the result
  await setCachedResponse(cacheKey, aiGenerationResult);

  return aiGenerationResult;
}
