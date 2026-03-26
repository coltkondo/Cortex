import { config, shouldUseMock } from '../../config/env';
import { mockAIClient } from './mockClient';
import { GeminiClient } from '../ai/geminiClient';
import { OllamaClient } from '../ai/ollamaClient';
import { AIClient } from '../ai/types';

let aiClient: AIClient;

if (shouldUseMock) {
  console.log('⚠️  Using MOCK AI client (no API key configured)');
  aiClient = mockAIClient;
} else if (config.aiProvider === 'ollama') {
  console.log(`✅ Using Ollama API client (${config.ollamaModel} on ${config.ollamaBaseUrl})`);
  aiClient = new OllamaClient(config.ollamaBaseUrl, config.ollamaModel);
} else if (config.aiProvider === 'gemini') {
  console.log('✅ Using REAL Gemini API client');
  aiClient = new GeminiClient(config.geminiApiKey);
} else {
  // Default to Ollama
  console.log(`✅ Using Ollama API client (${config.ollamaModel} on ${config.ollamaBaseUrl})`);
  aiClient = new OllamaClient(config.ollamaBaseUrl, config.ollamaModel);
}

export const claude = aiClient; // Keep 'claude' export name for backward compatibility
export const ai = aiClient; // New preferred name

export const MODEL = config.aiProvider === 'ollama' ? config.ollamaModel : 'gemini-2.5-flash';
export const MAX_TOKENS = 2048;
