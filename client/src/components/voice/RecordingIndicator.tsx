import { useLanguage } from '../../context';

interface RecordingIndicatorProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  onCancel: () => void;
  onSend: () => void;
  onRetry: () => void;
}

export function RecordingIndicator({
  isListening,
  transcript,
  interimTranscript,
  error,
  onCancel,
  onSend,
  onRetry,
}: RecordingIndicatorProps) {
  const { language } = useLanguage();

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
          onClick={onRetry}
          className="text-sm px-3 py-1 rounded bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
        >
          {language === 'ja' ? '再試行' : 'Retry'}
        </button>
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

  if (!isListening && !transcript && !interimTranscript) {
    return null;
  }

  const displayText = (transcript + ' ' + interimTranscript).trim();
  const hasContent = displayText.length > 0;

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
                {language === 'ja' ? '聞いています...' : 'Listening...'}
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
      <div className="px-4 py-3 min-h-[48px]">
        {hasContent ? (
          <p className="text-gray-800 dark:text-gray-200">
            {transcript && <span>{transcript} </span>}
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

      {/* Sound wave animation when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 py-2 bg-blue-100/50 dark:bg-blue-900/20">
          <div className="w-1 h-3 bg-blue-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
          <div className="w-1 h-5 bg-blue-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
          <div className="w-1 h-4 bg-blue-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
          <div className="w-1 h-6 bg-blue-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s]" />
          <div className="w-1 h-3 bg-blue-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s]" />
        </div>
      )}

      {/* Actions - show when not listening and has content */}
      {!isListening && hasContent && (
        <div className="flex gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {language === 'ja' ? 'キャンセル' : 'Cancel'}
          </button>
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
          <button
            onClick={onSend}
            className="flex-1 px-3 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {language === 'ja' ? '送信' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}
