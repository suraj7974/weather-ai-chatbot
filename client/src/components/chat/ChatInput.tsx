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
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-150">
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
              text-zinc-900 dark:text-zinc-100
              placeholder-zinc-400 dark:placeholder-zinc-500
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
              p-2.5 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-150
              flex-shrink-0
            "
            title={t("chat.send")}
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
    </div>
  );
}
