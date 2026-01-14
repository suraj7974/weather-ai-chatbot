import type { ChatSession, Theme, Language } from '../types';

// Storage keys
const STORAGE_KEYS = {
  SESSIONS: 'weather-chatbot-sessions',
  ACTIVE_SESSION: 'weather-chatbot-active',
  THEME: 'weather-chatbot-theme',
  LANGUAGE: 'weather-chatbot-language',
} as const;

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate session title from first user message
export function generateSessionTitle(message: string): string {
  // Truncate to first 30 characters
  const truncated = message.slice(0, 30);
  return message.length > 30 ? `${truncated}...` : truncated;
}

// Session storage utilities
export const sessionStorage = {
  // Get all sessions
  getSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) return [];
      const sessions = JSON.parse(data) as ChatSession[];
      // Sort by updatedAt descending (most recent first)
      return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  },

  // Get a single session by ID
  getSession(id: string): ChatSession | null {
    const sessions = this.getSessions();
    return sessions.find((s) => s.id === id) || null;
  },

  // Save a session (create or update)
  saveSession(session: ChatSession): void {
    try {
      const sessions = this.getSessions();
      const existingIndex = sessions.findIndex((s) => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...session, updatedAt: Date.now() };
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  // Delete a session
  deleteSession(id: string): void {
    try {
      const sessions = this.getSessions().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  },

  // Clear all sessions
  clearAllSessions(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  },

  // Get active session ID
  getActiveSessionId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Failed to get active session:', error);
      return null;
    }
  },

  // Set active session ID
  setActiveSessionId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (error) {
      console.error('Failed to set active session:', error);
    }
  },
};

// Theme storage utilities
export const themeStorage = {
  get(): Theme {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
      if (theme === 'light' || theme === 'dark') return theme;
      // Default to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },

  set(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },
};

// Language storage utilities
export const languageStorage = {
  get(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
      if (lang === 'en' || lang === 'ja') return lang;
      // Default based on browser language
      return navigator.language.startsWith('ja') ? 'ja' : 'en';
    } catch {
      return 'en';
    }
  },

  set(language: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  },
};
