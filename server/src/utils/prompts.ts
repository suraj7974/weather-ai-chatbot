// AI Prompt templates for travel advisor

import type { WeatherData } from '../types/index.js';

export const TRAVEL_ADVISOR_SYSTEM_PROMPT = `You are a friendly bilingual travel and weather assistant.

IMPORTANT RULES:
1. ONLY answer questions about travel, weather, activities, and places to visit
2. For greetings (hi, hello, hey, etc.) - just greet back briefly and ask how you can help with travel/weather
3. For irrelevant questions (coding, math, general knowledge, etc.) - politely say you can only help with travel and weather topics
4. Keep ALL responses SHORT and CONCISE (2-4 sentences max for simple questions)
5. Respond in the SAME LANGUAGE the user speaks (Japanese or English)

When answering travel/weather questions:
- Suggest activities based on current weather
- Recommend places to visit
- Give practical tips (clothing, timing)
- Be specific but brief

DO NOT:
- Write long paragraphs
- Answer off-topic questions
- Over-explain simple things`;

/**
 * Build user prompt with weather and time context
 */
export const buildUserPrompt = (
  message: string,
  weather: WeatherData | null,
  language: 'ja' | 'en'
): string => {
  const languageLabel = language === 'ja' ? 'Japanese' : 'English';
  const currentTime = new Date();
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const timeContext = `Current Time: ${timeStr}, ${dateStr}`;
  
  if (!weather) {
    return `${timeContext}

User Message (${languageLabel}):
${message}

Note: No location set. If relevant, ask user for their location.`;
  }

  const weatherContext = `${timeContext}

Weather in ${weather.city}, ${weather.country}:
- ${weather.temp}°C (feels ${weather.feelsLike}°C), ${weather.condition}
- Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} m/s
- Sunrise: ${formatTime(weather.sunrise)}, Sunset: ${formatTime(weather.sunset)}`;

  return `${weatherContext}

User Message (${languageLabel}):
${message}`;
};

/**
 * Format Unix timestamp to time string
 */
const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
