import { config, shouldUseMock } from '../../config/env';
import { mockAIClient } from './mockClient';
import { GeminiClient } from '../ai/geminiClient';
import { AIClient } from '../ai/types';

let aiClient: AIClient;

if (shouldUseMock) {
  console.log('⚠️  Using MOCK AI client (no API key configured)');
  aiClient = mockAIClient;
} else {
  console.log('✅ Using REAL Gemini API client');
  aiClient = new GeminiClient(config.geminiApiKey);
}

export const claude = aiClient; // Keep 'claude' export name for backward compatibility
export const ai = aiClient; // New preferred name

export const MODEL = 'gemini-2.5-flash';
export const MAX_TOKENS = 4096;
