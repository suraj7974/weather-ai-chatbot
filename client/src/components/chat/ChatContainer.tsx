import { useEffect, useRef } from 'react';
import { useChat } from '../../context';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat();
  const { isListening, isSupported, startListening, stopListening, transcript, resetTranscript } = useVoiceRecognition();
  const lastTranscriptRef = useRef<string>('');

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = (message: string) => {
    sendMessage(message);
  };

  // Auto-send voice transcript when done listening
  useEffect(() => {
    if (transcript && !isListening && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      sendMessage(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, sendMessage, resetTranscript]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        onVoiceClick={handleVoiceClick}
        isListening={isListening}
        voiceSupported={isSupported}
      />
    </div>
  );
}
