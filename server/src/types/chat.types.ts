// Chat-related types

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  location: {
    city: string;
    lat: number;
    lon: number;
  } | null;
  language: 'ja' | 'en';
  chatHistory: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  weather?: import('./weather.types.js').WeatherData;
}
