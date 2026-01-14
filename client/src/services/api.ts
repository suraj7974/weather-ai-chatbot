import axios, { AxiosError } from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  WeatherData,
  ForecastData,
  LocationData,
} from '../types';

// Base URL - uses Vite proxy in development
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message;
  }
  return 'An unexpected error occurred';
};

// Chat API
export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },
};

// Weather API
export const weatherApi = {
  getByCoordinates: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const response = await api.get<WeatherData>('/weather', {
        params: { lat, lon },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  getByCity: async (city: string): Promise<WeatherData> => {
    try {
      const response = await api.get<WeatherData>('/weather/city', {
        params: { q: city },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  getForecast: async (lat: number, lon: number): Promise<ForecastData> => {
    try {
      const response = await api.get<ForecastData>('/weather/forecast', {
        params: { lat, lon },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },
};

// Location API
export const locationApi = {
  search: async (query: string): Promise<LocationData[]> => {
    try {
      const response = await api.get<LocationData[]>('/location/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  reverseGeocode: async (lat: number, lon: number): Promise<LocationData | null> => {
    try {
      const response = await api.get<LocationData>('/location/reverse', {
        params: { lat, lon },
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocode error:', handleError(error));
      return null;
    }
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

export default api;
