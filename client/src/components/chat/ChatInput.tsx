import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { useLanguage } from '../../context';
import { VoiceButton } from '../voice';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onVoiceClick?: () => void;
  isListening?: boolean;
  voiceSupported?: boolean;
}

export function ChatInput({
  onSend,
  disabled = false,
  onVoiceClick,
  isListening = false,
  voiceSupported = true,
}: ChatInputProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
        {/* Voice button */}
        <VoiceButton
          isListening={isListening}
          isSupported={voiceSupported}
          onClick={onVoiceClick || (() => {})}
          disabled={disabled}
        />

        {/* Text input - simple input field */}
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? t('chat.listening') : t('chat.placeholder')}
          disabled={disabled || isListening}
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={t('chat.send')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
