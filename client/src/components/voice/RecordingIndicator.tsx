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
      <div className="max-w-md mx-auto bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900 overflow-hidden animate-fadeIn">
        <div className="flex items-center gap-3 px-4 py-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="flex-1 text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
          >
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-red-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!isListening && !transcript && !interimTranscript) {
    return null;
  }

  const displayText = (transcript + ' ' + interimTranscript).trim();
  const hasContent = displayText.length > 0;

  return (
    <div className="max-w-lg mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {isListening && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {language === 'ja' ? '聞いています...' : 'Listening...'}
              </span>
            </span>
          )}
          {!isListening && hasContent && (
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {language === 'ja' ? '音声入力完了' : 'Voice input ready'}
            </span>
          )}
        </div>
        
        <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
          {language === 'ja' ? '日本語' : 'EN'}
        </span>
      </div>

      {/* Transcript display */}
      <div className="px-4 py-3 min-h-[40px]">
        {hasContent ? (
          <p className="text-sm text-neutral-800 dark:text-neutral-200">
            {transcript && <span>{transcript} </span>}
            {interimTranscript && (
              <span className="text-neutral-400 italic">{interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-neutral-400 italic">
            {language === 'ja' ? '話してください...' : 'Speak now...'}
          </p>
        )}
      </div>

      {/* Sound wave animation when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 py-2 border-t border-neutral-200 dark:border-neutral-800">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-1 bg-neutral-500 rounded-full animate-pulse"
              style={{ 
                height: `${12 + (i % 3) * 4}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      )}

      {/* Actions - shown during listening AND after */}
      {(isListening || hasContent) && (
        <div className="flex gap-2 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
          <button
            onClick={onSend}
            disabled={!hasContent}
            className="flex-1 px-3 py-1.5 text-sm rounded-md bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {language === 'ja' ? '送信' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}
