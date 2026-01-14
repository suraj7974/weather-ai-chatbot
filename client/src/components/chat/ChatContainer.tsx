import { useChat, useLanguage } from "../../context";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { RecordingIndicator, BrowserCompatibility } from "../voice";

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

  const handleVoiceCancel = () => {
    stopListening();
    resetTranscript();
  };

  const handleVoiceSend = () => {
    const textToSend = (transcript + " " + interimTranscript).trim();
    if (textToSend) {
      sendMessage(textToSend);
      resetTranscript();
    }
  };

  const handleVoiceRetry = () => {
    resetTranscript();
    startListening();
  };

  const showRecordingIndicator =
    isListening || transcript || interimTranscript || error;

  return (
    <div className="flex flex-col h-full">
      {/* Browser compatibility warning */}
      <BrowserCompatibility
        isSupported={isSupported}
        browserName={browserName}
      />

      <MessageList messages={messages} isLoading={isLoading} />

      {/* Recording indicator */}
      {showRecordingIndicator && (
        <div className="px-4 pb-3">
          <RecordingIndicator
            isListening={isListening}
            transcript={transcript}
            interimTranscript={interimTranscript}
            error={error}
            onCancel={handleVoiceCancel}
            onSend={handleVoiceSend}
            onRetry={handleVoiceRetry}
          />
        </div>
      )}

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
