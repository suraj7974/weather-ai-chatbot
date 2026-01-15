import { useState, useCallback, useEffect, useRef } from 'react';
import type { Language } from '../types';

export interface UseTextToSpeechOptions {
  language: Language;
}

export interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions): UseTextToSpeechReturn {
  const { language } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Get language code for speech
  const getLanguageCode = useCallback((lang: Language): string => {
    return lang === 'ja' ? 'ja-JP' : 'en-US';
  }, []);

  // Find best voice for language
  const getBestVoice = useCallback((lang: Language): SpeechSynthesisVoice | null => {
    if (!isSupported) return null;
    
    const voices = speechSynthesis.getVoices();
    
    // Try to find a voice that matches the language
    const matchingVoices = voices.filter(voice => voice.lang.startsWith(lang === 'ja' ? 'ja' : 'en'));
    
    // Prefer natural/premium voices
    const preferredVoice = matchingVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('enhanced')
    );
    
    return preferredVoice || matchingVoices[0] || null;
  }, [isSupported]);

  // Stop any ongoing speech
  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Speak text
  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any ongoing speech first
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    
    const voice = getBestVoice(language);
    if (voice) {
      utterance.voice = voice;
    }

    // Adjust speech rate and pitch for better quality
    utterance.rate = language === 'ja' ? 0.9 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, language, getLanguageCode, getBestVoice, stop]);

  // Load voices (some browsers load them async)
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      speechSynthesis.getVoices();
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
