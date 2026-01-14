import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ChatMessage, LocationData, WeatherData } from '../types';
import { chatApi, weatherApi } from '../services/api';
import { useLanguage } from './LanguageContext';
import { useSession } from './SessionContext';
import { generateId } from '../utils/storage';

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

export function ChatProvider({ children }: { children: ReactNode }) {
  const { language, t } = useLanguage();
  const { activeSession, addMessage, updateSessionLocation, createSession } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Get messages and location from active session
  const messages = activeSession?.messages || [];
  const location = activeSession?.location || null;

  // Fetch weather when location changes
  useEffect(() => {
    if (location) {
      weatherApi
        .getByCoordinates(location.lat, location.lon)
        .then(setWeather)
        .catch((err) => console.error('Failed to fetch weather:', err));
    } else {
      setWeather(null);
    }
  }, [location]);

  const setLocation = useCallback(
    (newLocation: LocationData | null) => {
      updateSessionLocation(newLocation);
    },
    [updateSessionLocation]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Add user message to session
      addMessage(userMessage);
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

        // Add assistant message to session
        addMessage(assistantMessage);

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
        addMessage(errorChatMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, location, language, t, addMessage]
  );

  const clearChat = useCallback(() => {
    // Create a new session instead of clearing messages
    createSession();
    setError(null);
    setWeather(null);
  }, [createSession]);

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
