// Weather types
export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  conditionCode: number;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastItem {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
}

export interface ForecastData {
  city: string;
  items: ForecastItem[];
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequestLocation {
  city: string;
  lat: number;
  lon: number;
}

export interface ChatRequest {
  message: string;
  location: ChatRequestLocation | null;
  language: Language;
  chatHistory: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  weather?: WeatherData;
}

// Location types
export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// App-specific types
export type Language = 'ja' | 'en';
export type Theme = 'light' | 'dark';

// Voice recognition types
export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
