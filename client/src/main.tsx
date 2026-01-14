import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, LanguageProvider, ChatProvider } from './context';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
