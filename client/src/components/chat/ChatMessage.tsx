import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fadeIn">
        <div className="max-w-[75%] bg-indigo-600 text-white px-4 py-2.5 rounded-2xl">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-fadeIn">
      <div className="max-w-[85%]">
        <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
