import { useState, useEffect, useRef } from "react";
import { useChat, useLanguage } from "../../context";
import { useVoiceRecognition, useTextToSpeech } from "../../hooks";
import { voiceOutputStorage } from "../../utils/storage";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { RecordingIndicator, BrowserCompatibility } from "../voice";

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat();
  const { language } = useLanguage();

  // Voice recognition (input)
  const {
    isListening,
    isStarting,
    isSupported,
    transcript,
    interimTranscript,
    error,
    browserName,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({ language });

  // Voice output (TTS)
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({ language });
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(() => voiceOutputStorage.get());
  const lastMessageCountRef = useRef(messages.length);
  const lastMessageIdRef = useRef<string | null>(null);

  // Auto-speak new AI responses when voice output is enabled
  useEffect(() => {
    if (!voiceOutputEnabled || !ttsSupported) return;
    
    // Only speak when loading is finished (message is complete)
    // This prevents speaking partial messages during streaming
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Only speak assistant messages that we haven't spoken yet
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMessage.id;
        speak(lastMessage.content);
      }
    }
    
    lastMessageCountRef.current = messages.length;
  }, [isLoading, messages, voiceOutputEnabled, ttsSupported, speak]);

  // Toggle voice output
  const handleVoiceOutputToggle = () => {
    const newValue = !voiceOutputEnabled;
    setVoiceOutputEnabled(newValue);
    voiceOutputStorage.set(newValue);
    
    // If turning off while speaking, stop speaking
    if (!newValue && isSpeaking) {
      stopSpeaking();
    }
  };

  const handleVoiceClick = () => {
    if (isListening || isStarting) {
      // Stop button now closes the panel (same as cancel)
      stopListening();
      resetTranscript();
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
      stopListening();
      resetTranscript();
    }
  };

  const handleVoiceRetry = () => {
    startListening();
  };

  const showRecordingIndicator =
    isListening || isStarting || transcript || interimTranscript || error;

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
        // Voice output props
        voiceOutputEnabled={voiceOutputEnabled}
        isSpeaking={isSpeaking}
        voiceOutputSupported={ttsSupported}
        onVoiceOutputToggle={handleVoiceOutputToggle}
        onStopSpeaking={stopSpeaking}
      />
    </div>
  );
}
