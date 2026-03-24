/**
 * Common interface for all AI providers (Gemini, Claude, OpenAI, etc.)
 */

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: Array<{ text: string }>;
}

export interface AIClient {
  messages: {
    create(params: {
      model?: string;
      max_tokens?: number;
      messages: AIMessage[];
      temperature?: number;
    }): Promise<AIResponse>;
  };
}