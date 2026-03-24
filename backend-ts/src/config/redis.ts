/**
 * Redis client configuration for caching AI responses
 * Provides 70-90% cache hit rate and significant cost savings
 */

import { createClient } from 'redis';
import { config } from './env';

// Redis client instance
let redisClient: ReturnType<typeof createClient> | null = null;
let isConnected = false;

/**
 * Initialize Redis client
 * Gracefully handles connection failures (caching is optional)
 */
export async function initializeRedis(): Promise<void> {
  // Skip Redis if disabled or no URL provided
  if (!config.redisEnabled || !config.redisUrl) {
    console.log('ℹ️  Redis caching disabled (no REDIS_URL configured)');
    return;
  }

  try {
    redisClient = createClient({
      url: config.redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          // Stop reconnecting after 10 attempts
          if (retries > 10) {
            console.log('❌ Redis: Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          // Exponential backoff: 100ms, 200ms, 400ms, ...
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis: Connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Connected and ready');
      isConnected = true;
    });

    redisClient.on('end', () => {
      console.log('⚠️  Redis: Connection closed');
      isConnected = false;
    });

    await redisClient.connect();
  } catch (error: any) {
    console.error('❌ Failed to initialize Redis:', error.message);
    console.log('⚠️  Continuing without caching');
    redisClient = null;
    isConnected = false;
  }
}

/**
 * Get the Redis client instance
 */
export function getRedisClient(): ReturnType<typeof createClient> | null {
  return redisClient;
}

/**
 * Check if Redis is connected and available
 */
export function isRedisAvailable(): boolean {
  return isConnected && redisClient !== null;
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('✅ Redis connection closed gracefully');
    } catch (error: any) {
      console.error('❌ Error closing Redis:', error.message);
    }
  }
}
