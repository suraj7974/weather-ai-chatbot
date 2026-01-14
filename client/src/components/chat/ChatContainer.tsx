import { useChat, useLanguage } from '../../context';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { RecordingIndicator, BrowserCompatibility } from '../voice';

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat();
  const { language } = useLanguage();

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    browserName,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({ language });

  // Toggle voice recording
  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Send text message from input
  const handleSend = (message: string) => {
    sendMessage(message);
  };

  // Cancel voice input - clear transcript
  const handleVoiceCancel = () => {
    stopListening();
    resetTranscript();
  };

  // Send voice transcript - only when user clicks Send button
  const handleVoiceSend = () => {
    const textToSend = (transcript + interimTranscript).trim();
    if (textToSend) {
      sendMessage(textToSend);
      resetTranscript();
    }
  };

  // Check if we should show the recording indicator
  const showRecordingIndicator = isListening || transcript || interimTranscript || error;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Browser compatibility warning */}
      <BrowserCompatibility isSupported={isSupported} browserName={browserName} />

      {/* Message list */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Recording indicator - shows when listening or has transcript */}
      {showRecordingIndicator && (
        <div className="px-4 pb-2">
          <RecordingIndicator
            isListening={isListening}
            transcript={transcript}
            interimTranscript={interimTranscript}
            error={error}
            onCancel={handleVoiceCancel}
            onSend={handleVoiceSend}
          />
        </div>
      )}

      {/* Chat input */}
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
