import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ChatMessage, LocationData, WeatherData } from '../types';
import { chatApi, weatherApi } from '../services/api';
import { useLanguage } from './LanguageContext';

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  location: LocationData | null;
  weather: WeatherData | null;
  sendMessage: (content: string) => Promise<void>;
  setLocation: (location: LocationData | null) => void;
  clearChat: () => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: generateId(),
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const setLocation = useCallback(async (newLocation: LocationData | null) => {
    setLocationState(newLocation);
    if (newLocation) {
      try {
        const weatherData = await weatherApi.getByCoordinates(
          newLocation.lat,
          newLocation.lon
        );
        setWeather(weatherData);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    } else {
      setWeather(null);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Get recent chat history (last 10 messages for context)
        const chatHistory = messages.slice(-10);

        const response = await chatApi.sendMessage({
          message: content.trim(),
          location: location
            ? { city: location.name, lat: location.lat, lon: location.lon }
            : null,
          language,
          chatHistory,
        });

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response.response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update weather if returned
        if (response.weather) {
          setWeather(response.weather);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('error.generic');
        setError(errorMessage);

        // Add error message to chat
        const errorChatMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorChatMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, location, language, t]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: t('chat.welcome'),
        timestamp: Date.now(),
      },
    ]);
    setError(null);
  }, [t]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        location,
        weather,
        sendMessage,
        setLocation,
        clearChat,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
