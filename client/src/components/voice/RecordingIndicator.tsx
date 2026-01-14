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
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900 overflow-hidden animate-fadeIn">
        <div className="flex items-center gap-3 px-4 py-3">
          <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="flex-1 text-sm text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm px-3 py-1.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors"
          >
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-rose-400 hover:text-rose-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
    <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-900 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-indigo-100 dark:border-indigo-900">
        <div className="flex items-center gap-2">
          {isListening && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {language === 'ja' ? '聞いています...' : 'Listening...'}
              </span>
            </span>
          )}
          {!isListening && hasContent && (
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {language === 'ja' ? '音声入力完了' : 'Voice input ready'}
            </span>
          )}
        </div>
        
        <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-medium">
          {language === 'ja' ? '日本語' : 'EN'}
        </span>
      </div>

      {/* Transcript display */}
      <div className="px-4 py-3 min-h-[40px]">
        {hasContent ? (
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            {transcript && <span>{transcript} </span>}
            {interimTranscript && (
              <span className="text-zinc-400 italic">{interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-zinc-400 italic">
            {language === 'ja' ? '話してください...' : 'Speak now...'}
          </p>
        )}
      </div>

      {/* Sound wave animation when listening */}
      {isListening && (
        <div className="flex items-center justify-center gap-1 py-2 border-t border-indigo-100 dark:border-indigo-900">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-1 bg-indigo-500 rounded-full animate-pulse"
              style={{ 
                height: `${12 + (i % 3) * 4}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {!isListening && hasContent && (
        <div className="flex gap-2 px-4 py-3 border-t border-indigo-100 dark:border-indigo-900">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {language === 'ja' ? 'キャンセル' : 'Cancel'}
          </button>
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {language === 'ja' ? '再試行' : 'Retry'}
          </button>
          <button
            onClick={onSend}
            className="flex-1 px-3 py-1.5 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {language === 'ja' ? '送信' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}
