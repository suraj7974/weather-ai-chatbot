import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let showTimer: number;
    let hideTimer: number;

    if (!isEnabled && isSupported) {
      // Show hint after 1 second
      showTimer = setTimeout(() => {
        setShowHint(true);
      }, 1000);

      // Hide hint after 7 seconds (1s delay + 6s display)
      hideTimer = setTimeout(() => {
        setShowHint(false);
      }, 7000);
    } else {
      setShowHint(false);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isEnabled, isSupported]);

  if (!isSupported) {
    return (
      <div className="flex flex-row items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2">
        <button
          disabled
          className="
            p-2 rounded-lg
            bg-neutral-100 dark:bg-neutral-900
            text-neutral-400 cursor-not-allowed
            hover:shadow-md hover:shadow-neutral-400/20 hover:scale-[1.03]
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
    setShowHint(false);
    if (isSpeaking) {
      onStop();
    } else {
      onToggle();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group relative flex flex-row items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      title={
        isSpeaking
          ? t('voice.stopSpeaking')
          : isEnabled
            ? t('voice.outputOn')
            : t('voice.outputOff')
      }
    >
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xl">
              {t('voice.turnOnHint')}
              {/* Triangle arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`
          relative p-2 rounded-lg
          transition-all duration-200 ease-out
          ${isEnabled
            ? isSpeaking
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-xl shadow-green-500/40 scale-100 rounded-lg'
              : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/40 group-hover:scale-[1.03] rounded-lg'
            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700 group-hover:shadow-md group-hover:shadow-neutral-400/20 group-hover:scale-[1.03] rounded-lg'
          }
        `}
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
      </div>
      
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
          {isSpeaking ? t('voice.statusLive') : isEnabled ? t('voice.statusOn') : t('voice.statusOff')}
        </span>
      </div>
    </button>
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
