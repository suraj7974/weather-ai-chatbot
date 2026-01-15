import { useLanguage } from '../../context';

interface VoiceOutputButtonProps {
  isEnabled: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  onToggle: () => void;
  onStop: () => void;
}

export function VoiceOutputButton({ 
  isEnabled, 
  isSpeaking, 
  isSupported, 
  onToggle,
  onStop 
}: VoiceOutputButtonProps) {
  const { t } = useLanguage();

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          disabled
          className="
            p-2.5 rounded-xl
            bg-neutral-100 dark:bg-neutral-900
            text-neutral-400 cursor-not-allowed
          "
          title={t('voice.notSupported')}
        >
          <SpeakerOffIcon />
        </button>
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
          N/A
        </span>
      </div>
    );
  }

  const handleClick = () => {
    if (isSpeaking) {
      onStop();
    } else {
      onToggle();
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleClick}
        className={`
          relative p-2.5 rounded-xl
          transition-all duration-200 ease-out
          ${isEnabled 
            ? isSpeaking
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105'
              : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105'
            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:scale-105'
          }
        `}
        title={
          isSpeaking 
            ? t('voice.stopSpeaking') 
            : isEnabled 
              ? t('voice.outputOn') 
              : t('voice.outputOff')
        }
      >
        {/* Animated rings when speaking */}
        {isSpeaking && (
          <>
            <span className="absolute inset-0 rounded-xl bg-green-400 animate-ping opacity-30" />
            <span className="absolute inset-[-2px] rounded-xl border-2 border-green-400 animate-pulse opacity-50" />
          </>
        )}
        
        {/* Subtle glow when enabled */}
        {isEnabled && !isSpeaking && (
          <span className="absolute inset-0 rounded-xl bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity" />
        )}
        
        <span className="relative flex items-center justify-center">
          {isSpeaking ? <SpeakingIcon /> : isEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </span>
      </button>
      
      {/* Status indicator */}
      <div className={`
        flex items-center gap-1 px-1.5 py-0.5 rounded-full
        transition-all duration-200
        ${isEnabled 
          ? isSpeaking
            ? 'bg-green-100 dark:bg-green-900/40'
            : 'bg-green-100 dark:bg-green-900/30'
          : 'bg-neutral-100 dark:bg-neutral-800'
        }
      `}>
        {/* Status dot */}
        <span className={`
          w-1.5 h-1.5 rounded-full
          transition-all duration-200
          ${isEnabled 
            ? isSpeaking
              ? 'bg-green-500 animate-pulse'
              : 'bg-green-500'
            : 'bg-neutral-400 dark:bg-neutral-500'
          }
        `} />
        
        {/* Status text */}
        <span className={`
          text-[10px] font-semibold uppercase tracking-wider
          transition-colors duration-200
          ${isEnabled 
            ? 'text-green-600 dark:text-green-400'
            : 'text-neutral-500 dark:text-neutral-400'
          }
        `}>
          {isSpeaking ? 'Live' : isEnabled ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function SpeakingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {/* Animated sound waves */}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className="animate-pulse" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className="animate-pulse" style={{ animationDelay: '150ms' }} />
    </svg>
  );
}
