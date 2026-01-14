import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'weather-chatbot-language';

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'Weather Travel Assistant',
    'app.subtitle': 'Your AI-powered travel companion',
    'chat.placeholder': 'Ask about weather or travel tips...',
    'chat.send': 'Send',
    'chat.listening': 'Listening...',
    'chat.welcome': 'Hello! I can help you with weather information and travel tips. Where would you like to explore?',
    'weather.temperature': 'Temperature',
    'weather.feelsLike': 'Feels like',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.forecast': '5-Day Forecast',
    'location.search': 'Search location...',
    'location.current': 'Use current location',
    'location.detecting': 'Detecting location...',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'language.switch': 'Japanese',
    'error.generic': 'Something went wrong',
    'error.location': 'Could not get your location',
    'error.weather': 'Could not fetch weather data',
    'voice.start': 'Start voice input',
    'voice.stop': 'Stop listening',
    'voice.notSupported': 'Voice input not supported',
    'chat.newChat': 'New Chat',
    'chat.sessions': 'Chat History',
    'chat.deleteSession': 'Delete chat',
    'chat.clearAll': 'Clear all chats',
  },
  ja: {
    'app.title': '天気旅行アシスタント',
    'app.subtitle': 'AIパワードの旅行コンパニオン',
    'chat.placeholder': '天気や旅行のヒントを聞いてください...',
    'chat.send': '送信',
    'chat.listening': '聞いています...',
    'chat.welcome': 'こんにちは！天気情報や旅行のヒントをお手伝いします。どこを探索したいですか？',
    'weather.temperature': '気温',
    'weather.feelsLike': '体感温度',
    'weather.humidity': '湿度',
    'weather.wind': '風速',
    'weather.forecast': '5日間予報',
    'location.search': '場所を検索...',
    'location.current': '現在地を使用',
    'location.detecting': '位置を検出中...',
    'theme.light': 'ライト',
    'theme.dark': 'ダーク',
    'language.switch': 'English',
    'error.generic': 'エラーが発生しました',
    'error.location': '位置情報を取得できませんでした',
    'error.weather': '天気データを取得できませんでした',
    'voice.start': '音声入力を開始',
    'voice.stop': '聞き取りを停止',
    'voice.notSupported': '音声入力はサポートされていません',
    'chat.newChat': '新しいチャット',
    'chat.sessions': 'チャット履歴',
    'chat.deleteSession': 'チャットを削除',
    'chat.clearAll': 'すべてのチャットを削除',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) {
      return 'ja';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
