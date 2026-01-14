import { useLanguage } from '../../context';
import type { Language } from '../../types';

interface LanguageSelectorProps {
  compact?: boolean;
  showLabel?: boolean;
}

export function LanguageSelector({ compact = false, showLabel = true }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  if (compact) {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title={t('language.switch')}
      >
        <span>{language === 'en' ? '🇯🇵' : '🇺🇸'}</span>
        <span className="text-xs">{language === 'en' ? 'JA' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {language === 'en' ? 'Language:' : '言語:'}
        </span>
      )}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              flex items-center gap-1 px-3 py-1.5 text-sm transition-colors
              ${language === lang.code
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <span>{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
