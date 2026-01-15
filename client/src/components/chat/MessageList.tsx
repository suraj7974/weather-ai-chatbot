import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { useLanguage } from '../../context';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-neutral-500 text-sm">{t('chat.emptyState')}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator - typing style */}
        {isLoading && (
          <div className="flex justify-start mb-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="flex gap-1 items-center pt-2">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
