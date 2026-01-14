// Groq service - LLM integration

import Groq from 'groq-sdk';
import { config } from '../config/env.js';
import type { ChatMessage } from '../types/index.js';

const groq = new Groq({
  apiKey: config.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generate chat response using Groq
 */
export const generateChatResponse = async (
  systemPrompt: string,
  userPrompt: string,
  chatHistory: ChatMessage[]
): Promise<string> => {
  // Convert chat history to Groq format
  const historyMessages = chatHistory.slice(-10).map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...historyMessages,
    { role: 'user', content: userPrompt },
  ];

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || '';
};
