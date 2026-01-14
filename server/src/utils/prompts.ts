// AI Prompt templates for travel advisor

import type { WeatherData } from '../types/index.js';

export const TRAVEL_ADVISOR_SYSTEM_PROMPT = `You are a friendly bilingual travel and activity advisor assistant.

Based on the current weather conditions provided, you suggest:
- Outdoor activities when weather is good
- Indoor alternatives when weather is bad
- Specific places to visit in the user's location
- Best times for activities based on forecast
- Practical tips (what to wear, what to bring)

Always consider:
- Temperature and comfort levels
- Rain/snow probability
- Wind conditions
- Sunrise/sunset times for outdoor activities
- Local attractions and seasonal events

Response Guidelines:
- Respond in the SAME LANGUAGE the user speaks (Japanese or English)
- Keep responses concise but helpful (2-3 paragraphs max)
- Be specific with recommendations when possible
- Include weather-appropriate clothing suggestions
- If weather is bad, focus on indoor alternatives
- Be enthusiastic and helpful!

Current Weather Context will be provided with each message.`;

/**
 * Build user prompt with weather context
 */
export const buildUserPrompt = (
  message: string,
  weather: WeatherData | null,
  language: 'ja' | 'en'
): string => {
  const languageLabel = language === 'ja' ? 'Japanese' : 'English';
  
  if (!weather) {
    return `User Message (${languageLabel}):
${message}

Note: Weather data is not available. Please ask the user for their location or provide general advice.`;
  }

  const weatherContext = `Current Weather in ${weather.city}, ${weather.country}:
- Temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%
- Wind: ${weather.windSpeed} m/s
- Sunrise: ${formatTime(weather.sunrise)}
- Sunset: ${formatTime(weather.sunset)}`;

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
