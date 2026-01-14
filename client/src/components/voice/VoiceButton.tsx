import { useLanguage } from '../../context';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, isSupported, onClick, disabled = false }: VoiceButtonProps) {
  const { t } = useLanguage();

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-1.5 rounded-full text-gray-400 cursor-not-allowed"
        title={t('voice.notSupported')}
      >
        <MicOffIcon />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-1.5 rounded-full transition-all duration-200
        ${isListening 
          ? 'text-red-500 bg-red-100 dark:bg-red-900/30' 
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={isListening ? t('voice.stop') : t('voice.start')}
    >
      {/* Pulse animation when listening */}
      {isListening && (
        <span className="absolute inset-0 rounded-full bg-red-200 dark:bg-red-800/40 animate-ping opacity-75" />
      )}
      
      <span className="relative">
        {isListening ? <StopIcon /> : <MicIcon />}
      </span>
    </button>
  );
}

// Microphone icon
function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Stop icon (square) - shown when recording
function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

// Microphone off icon
function MicOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
    </svg>
  );
}
