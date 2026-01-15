import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { useLanguage } from "../../context";
import { VoiceButton } from "../voice";

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
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-2 focus-within:border-neutral-400 dark:focus-within:border-neutral-600 transition-colors duration-150 shadow-sm">
          {/* Voice button */}
          <VoiceButton
            isListening={isListening}
            isSupported={voiceSupported}
            onClick={onVoiceClick || (() => {})}
            disabled={disabled}
          />

          {/* Text input */}
          <textarea
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening ? t("chat.listening") : t("chat.placeholder")
            }
            disabled={disabled || isListening}
            rows={1}
            className="
              flex-1 resize-none py-2
              bg-transparent
              text-neutral-900 dark:text-neutral-100
              placeholder-neutral-400 dark:placeholder-neutral-600
              text-sm leading-5
              outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              max-h-32
            "
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="
              p-2 rounded-md
              bg-neutral-900 hover:bg-neutral-800
              dark:bg-neutral-100 dark:hover:bg-neutral-200
              text-white dark:text-neutral-900
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-150
              flex-shrink-0
            "
            title={t("chat.send")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
