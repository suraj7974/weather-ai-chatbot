// Chat controller

import type { Request, Response, NextFunction } from 'express';
import { getWeatherByCoords } from '../services/weather.service.js';
import { generateChatResponse } from '../services/groq.service.js';
import { TRAVEL_ADVISOR_SYSTEM_PROMPT, buildUserPrompt } from '../utils/prompts.js';
import type { ChatRequest, ChatResponse } from '../types/index.js';

/**
 * Handle chat message and generate AI response
 */
export const handleChat = async (
  req: Request<{}, ChatResponse, ChatRequest>,
  res: Response<ChatResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, location, language, chatHistory } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ response: 'Message is required' });
      return;
    }

    // Get weather data if location is provided
    let weather = null;
    if (location && location.lat && location.lon) {
      try {
        weather = await getWeatherByCoords(location.lat, location.lon);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        // Continue without weather data
      }
    }

    // Build prompt with weather context
    const userPrompt = buildUserPrompt(message, weather, language || 'en');

    // Generate AI response
    const aiResponse = await generateChatResponse(
      TRAVEL_ADVISOR_SYSTEM_PROMPT,
      userPrompt,
      chatHistory || []
    );

    res.json({
      response: aiResponse,
      weather: weather || undefined,
    });
  } catch (error) {
    next(error);
  }
};
