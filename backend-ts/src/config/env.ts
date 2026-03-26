import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  // Ollama configuration
  aiProvider: process.env.AI_PROVIDER || 'ollama', // 'ollama', 'gemini', or 'claude'
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1/',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  useMockAI: process.env.USE_MOCK_AI?.toLowerCase() === 'true',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  databasePath: process.env.DATABASE_PATH || './cortex.db',
  // Redis caching configuration
  redisUrl: process.env.REDIS_URL || '',
  redisEnabled: process.env.REDIS_ENABLED?.toLowerCase() !== 'false', // Enabled by default if REDIS_URL is provided
};

// Determine if we should use mock mode
export const shouldUseMock =
  config.useMockAI ||
  (config.aiProvider === 'gemini' && (!config.geminiApiKey || config.geminiApiKey === ''));
