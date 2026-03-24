/**
 * Google Gemini AI client implementation
 * Uses Gemini 2.5 Flash model with free tier (60 requests/minute)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIClient, AIResponse, AIMessage } from './types';

export class GeminiClient implements AIClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash - latest fast model
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  messages = {
    create: async (params: {
      model?: string;
      max_tokens?: number;
      messages: AIMessage[];
      temperature?: number;
    }): Promise<AIResponse> => {
      // Extract the user message (Gemini uses a simpler format)
      const userMessage = params.messages.find((m) => m.role === 'user')?.content || '';

      try {
        // Generate content using Gemini
        const aiGenerationResult = await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            maxOutputTokens: params.max_tokens || 4096,
            temperature: params.temperature || 0.7,
          },
        });

        const response = await aiGenerationResult.response;
        const text = response.text();

        // Return in Claude-compatible format
        return {
          content: [{ text }],
        };
      } catch (error: any) {
        console.error('Gemini API error:', error);
        throw new Error(`Gemini API failed: ${error.message}`);
      }
    },
  };
}
