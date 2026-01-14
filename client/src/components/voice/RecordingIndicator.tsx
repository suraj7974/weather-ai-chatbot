import { useLanguage } from '../../context';

interface RecordingIndicatorProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  onCancel: () => void;
  onSend: () => void;
}

export function RecordingIndicator({
  isListening,
  transcript,
  interimTranscript,
  error,
  onCancel,
  onSend,
}: RecordingIndicatorProps) {
  const { t, language } = useLanguage();

  if (error) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={onCancel}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  if (!isListening && !transcript) {
    return null;
  }

  const displayText = transcript + interimTranscript;
  const hasContent = displayText.trim().length > 0;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-100 dark:bg-blue-900/40">
        <div className="flex items-center gap-2">
          {isListening && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t('chat.listening')}
              </span>
            </span>
          )}
          {!isListening && hasContent && (
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {language === 'ja' ? '音声入力完了' : 'Voice input ready'}
            </span>
          )}
        </div>
        
        {/* Language indicator */}
        <span className="text-xs px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
          {language === 'ja' ? '日本語' : 'English'}
        </span>
      </div>

      {/* Transcript display */}
      <div className="px-4 py-3">
        {hasContent ? (
          <p className="text-gray-800 dark:text-gray-200">
            <span>{transcript}</span>
            {interimTranscript && (
              <span className="text-gray-400 dark:text-gray-500 italic">{interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            {language === 'ja' ? '話してください...' : 'Speak now...'}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isListening && hasContent && (
        <div className="flex gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {language === 'ja' ? 'キャンセル' : 'Cancel'}
          </button>
          <button
            onClick={onSend}
            className="flex-1 px-3 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {language === 'ja' ? '送信' : 'Send'}
          </button>
        </div>
      )}

      {/* Sound wave animation when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 py-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-blue-500 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
