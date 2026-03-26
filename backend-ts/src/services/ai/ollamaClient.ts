/**
 * Ollama AI client implementation using OpenAI API compatibility
 * Uses Ollama with OpenAI SDK - llama2, llama3.2, or other models
 * 
 * Note: Ollama must be running locally on http://localhost:11434
 * Pull model first: ollama pull llama3.2:3b
 */

import OpenAI from 'openai';
import { AIClient, AIResponse, AIMessage } from './types';

export class OllamaClient implements AIClient {
  private client: OpenAI;

  constructor(baseUrl: string = 'http://localhost:11434/v1/', modelName?: string) {
    this.client = new OpenAI({
      baseURL: baseUrl,
      apiKey: 'ollama', // Required but ignored by Ollama
    });
  }

  messages = {
    create: async (params: {
      model?: string;
      max_tokens?: number;
      messages: AIMessage[];
      temperature?: number;
    }): Promise<AIResponse> => {
      try {
        const response = await this.client.chat.completions.create({
          model: params.model || 'llama3.2:3b',
          messages: params.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: params.max_tokens || 2048,
          temperature: params.temperature || 0.7,
        });

        const textContent = response.choices[0]?.message?.content || '';

        // Return in standard AI format
        return {
          content: [{ text: textContent }],
        };
      } catch (error: any) {
        console.error('Ollama API error:', error);
        throw new Error(`Ollama API failed: ${error.message}`);
      }
    },
  };
}
