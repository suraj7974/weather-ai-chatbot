import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ChatSession, ChatMessage, LocationData } from '../types';
import { sessionStorage, generateId, generateSessionTitle } from '../utils/storage';
import { useLanguage } from './LanguageContext';

interface SessionContextType {
  // Session list
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  
  // Session operations
  createSession: () => ChatSession;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  
  // Active session operations
  addMessage: (message: ChatMessage) => void;
  updateSessionLocation: (location: LocationData | null) => void;
  updateSessionTitle: (title: string) => void;
  
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  // Initialize sidebar state based on screen width
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Get active session from sessions list
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Create a new empty session
  const createNewSession = useCallback((): ChatSession => {
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: Date.now(),
    };

    return {
      id: generateId(),
      title: t('chat.newChat'),
      messages: [welcomeMessage],
      location: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }, [t]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = sessionStorage.getSessions();
    const savedActiveId = sessionStorage.getActiveSessionId();

    if (savedSessions.length > 0) {
      setSessions(savedSessions);
      // If there's a saved active session and it exists, use it
      if (savedActiveId && savedSessions.some((s) => s.id === savedActiveId)) {
        setActiveSessionId(savedActiveId);
      } else {
        // Otherwise use the most recent session
        setActiveSessionId(savedSessions[0].id);
      }
    } else {
      // No saved sessions - start with empty state
      // User needs to click "New Chat" to start
      setSessions([]);
      setActiveSessionId(null);
    }
  }, []);

  // Create a new session
  const createSession = useCallback((): ChatSession => {
    const newSession = createNewSession();
    
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    
    sessionStorage.saveSession(newSession);
    sessionStorage.setActiveSessionId(newSession.id);
    
    return newSession;
  }, [createNewSession]);

  // Switch to a different session
  const switchSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveSessionId(id);
      sessionStorage.setActiveSessionId(id);
    }
  }, [sessions]);

  // Delete a session
  const deleteSession = useCallback((id: string) => {
    const currentSessions = sessions;
    const filtered = currentSessions.filter((s) => s.id !== id);
    
    // Update sessions state
    setSessions(filtered);
    
    // If we deleted the active session, switch to another or set to null
    if (id === activeSessionId) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
        sessionStorage.setActiveSessionId(filtered[0].id);
      } else {
        // No sessions left - set active to null
        setActiveSessionId(null);
        sessionStorage.setActiveSessionId('');
      }
    }
    
    sessionStorage.deleteSession(id);
  }, [sessions, activeSessionId]);

  // Clear all sessions
  const clearAllSessions = useCallback(() => {
    const newSession = createNewSession();
    setSessions([newSession]);
    setActiveSessionId(newSession.id);
    sessionStorage.clearAllSessions();
    sessionStorage.saveSession(newSession);
    sessionStorage.setActiveSessionId(newSession.id);
  }, [createNewSession]);

  // Add a message to the active session
  const addMessage = useCallback((message: ChatMessage) => {
    if (!activeSessionId) return;

    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const updatedMessages = [...session.messages, message];
        
        // Auto-generate title from first user message
        let newTitle = session.title;
        if (
          message.role === 'user' &&
          session.messages.filter((m) => m.role === 'user').length === 0
        ) {
          newTitle = generateSessionTitle(message.content);
        }

        const updatedSession: ChatSession = {
          ...session,
          messages: updatedMessages,
          title: newTitle,
          updatedAt: Date.now(),
        };

        // Save to localStorage
        sessionStorage.saveSession(updatedSession);

        return updatedSession;
      });
    });
  }, [activeSessionId]);

  // Update active session's location
  const updateSessionLocation = useCallback((location: LocationData | null) => {
    if (!activeSessionId) return;

    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const updatedSession: ChatSession = {
          ...session,
          location,
          updatedAt: Date.now(),
        };

        sessionStorage.saveSession(updatedSession);
        return updatedSession;
      });
    });
  }, [activeSessionId]);

  // Update active session's title
  const updateSessionTitle = useCallback((title: string) => {
    if (!activeSessionId) return;

    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const updatedSession: ChatSession = {
          ...session,
          title,
          updatedAt: Date.now(),
        };

        sessionStorage.saveSession(updatedSession);
        return updatedSession;
      });
    });
  }, [activeSessionId]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSession,
        createSession,
        switchSession,
        deleteSession,
        clearAllSessions,
        addMessage,
        updateSessionLocation,
        updateSessionTitle,
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
