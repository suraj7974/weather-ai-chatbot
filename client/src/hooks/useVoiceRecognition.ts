import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '../types';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onnomatch: (() => void) | null;
  onaudiostart: (() => void) | null;
  onaudioend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface VoiceRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  browserName: string | null;
}

export interface UseVoiceRecognitionOptions {
  language: Language;
}

export interface UseVoiceRecognitionReturn extends VoiceRecognitionState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Detect browser for compatibility info
function detectBrowser(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  return 'Unknown';
}

// Check browser compatibility
function checkCompatibility(): { supported: boolean; browser: string } {
  const browser = detectBrowser();
  const hasAPI = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  
  // Firefox doesn't support Web Speech API well
  const supported = hasAPI && browser !== 'Firefox';
  
  return { supported, browser };
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions): UseVoiceRecognitionReturn {
  const { language } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { supported: isSupported, browser: browserName } = checkCompatibility();

  // Get language code for recognition
  const getLanguageCode = useCallback((lang: Language): string => {
    return lang === 'ja' ? 'ja-JP' : 'en-US';
  }, []);

  // Initialize recognition instance
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = true; // Get results while speaking
    recognition.maxAlternatives = 1;
    recognition.lang = getLanguageCode(language);

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      // Update transcript with all final results
      setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Don't treat 'no-speech' as error, just stop listening
      if (event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      
      // Handle aborted gracefully
      if (event.error === 'aborted') {
        setIsListening(false);
        return;
      }
      
      setError(getErrorMessage(event.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clear interim when stopped - keep only final transcript
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore abort errors
        }
      }
    };
  }, [isSupported, getLanguageCode, language]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = getLanguageCode(language);
    }
  }, [language, getLanguageCode, isListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    // Reset state
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      // Handle "already started" error
      if (err instanceof Error && err.message.includes('already started')) {
        return;
      }
      console.error('Failed to start recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Failed to stop recognition:', err);
      // Force state update
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    browserName,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// Helper to get user-friendly error messages
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'not-allowed': 'Microphone access denied. Please allow microphone access.',
    'no-speech': 'No speech detected. Please try again.',
    'audio-capture': 'No microphone found. Please check your device.',
    'network': 'Network error. Please check your connection.',
    'service-not-allowed': 'Speech service not allowed.',
    'bad-grammar': 'Speech grammar error.',
    'language-not-supported': 'Language not supported.',
  };
  
  return errorMessages[error] || `Speech recognition error: ${error}`;
}
