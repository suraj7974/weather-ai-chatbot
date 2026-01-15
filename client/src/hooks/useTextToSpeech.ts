import { useState, useCallback, useEffect, useRef } from "react";
import type { Language } from "../types";

export interface UseTextToSpeechOptions {
  language: Language;
}

export interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(
  options: UseTextToSpeechOptions,
): UseTextToSpeechReturn {
  const { language } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Get language code for speech
  const getLanguageCode = useCallback((lang: Language): string => {
    return lang === "ja" ? "ja-JP" : "en-US";
  }, []);

  // Load voices (some browsers load them async)
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // Find best voice for language
  const getBestVoice = useCallback(
    (lang: Language): SpeechSynthesisVoice | null => {
      if (!isSupported) return null;

      const voices = speechSynthesis.getVoices();

      // Try to find a voice that matches the language
      const matchingVoices = voices.filter((voice) =>
        voice.lang.startsWith(lang === "ja" ? "ja" : "en"),
      );

      // Priority 1: Female voices with "Natural", "Premium", or "Enhanced"
      const isFemale = (name: string) => {
        const n = name.toLowerCase();
        return (
          n.includes("female") ||
          n.includes("woman") ||
          n.includes("google us english") ||
          n.includes("google 日本語") ||
          n.includes("zira") || // Windows (En)
          n.includes("samantha") || // macOS (En)
          n.includes("eva") || // Windows (En)
          n.includes("kyoko") || // macOS (Ja)
          n.includes("haruka") || // Windows (Ja)
          n.includes("ayumi") || // Windows (Ja)
          n.includes("sayaka") || // Windows (Ja)
          n.includes("nanami")
        ); // Azure/Windows (Ja)
      };

      let preferredVoice = matchingVoices.find(
        (v) =>
          isFemale(v.name) &&
          (v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("premium") ||
            v.name.toLowerCase().includes("enhanced")),
      );

      // Priority 2: Any Female voice
      if (!preferredVoice) {
        preferredVoice = matchingVoices.find((v) => isFemale(v.name));
      }

      // Priority 3: Any high quality voice
      if (!preferredVoice) {
        preferredVoice = matchingVoices.find(
          (v) =>
            v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("premium") ||
            v.name.toLowerCase().includes("enhanced"),
        );
      }

      return preferredVoice || matchingVoices[0] || null;
    },
    [isSupported, voicesLoaded],
  );

  // Stop any ongoing speech
  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Speak text
  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;

      // Stop previous speech only if currently speaking
      // This prevents unnecessary interruptions if the engine is idle
      // but safer to cancel if we are starting a NEW utterance
      speechSynthesis.cancel();
      setIsSpeaking(false);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);

      const voice = getBestVoice(language);
      if (voice) {
        utterance.voice = voice;
      }

      // Adjust speech rate and pitch for better quality
      utterance.rate = language === "ja" ? 0.9 : 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [isSupported, language, getLanguageCode, getBestVoice],
  );

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
