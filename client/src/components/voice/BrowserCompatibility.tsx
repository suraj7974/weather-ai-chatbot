import { useState } from 'react';
import { useLanguage } from '../../context';

interface BrowserCompatibilityProps {
  isSupported: boolean;
  browserName: string | null;
}

export function BrowserCompatibility({ isSupported, browserName }: BrowserCompatibilityProps) {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (isSupported || dismissed) {
    return null;
  }

  const messages = {
    en: {
      title: 'Voice Input Not Supported',
      description: browserName === 'Firefox' 
        ? 'Firefox does not support the Web Speech API. Please use Chrome, Edge, or Safari for voice input.'
        : 'Your browser does not support voice input. Please use Chrome, Edge, or Safari.',
      dismiss: 'Dismiss',
      supported: 'Supported browsers: Chrome, Edge, Safari',
    },
    ja: {
      title: '音声入力がサポートされていません',
      description: browserName === 'Firefox'
        ? 'FirefoxはWeb Speech APIをサポートしていません。音声入力を使用するには、Chrome、Edge、またはSafariをご利用ください。'
        : 'お使いのブラウザは音声入力をサポートしていません。Chrome、Edge、またはSafariをご利用ください。',
      dismiss: '閉じる',
      supported: '対応ブラウザ: Chrome, Edge, Safari',
    },
  };

  const t = messages[language];

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {t.title}
          </h4>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            {t.description}
          </p>
          <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            {t.supported}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
