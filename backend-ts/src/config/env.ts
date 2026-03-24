import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  useMockAI: process.env.USE_MOCK_AI?.toLowerCase() === 'true',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  databasePath: process.env.DATABASE_PATH || './cortex.db',
};

// Determine if we should use mock mode
export const shouldUseMock =
  config.useMockAI ||
  !config.geminiApiKey ||
  config.geminiApiKey === '';
