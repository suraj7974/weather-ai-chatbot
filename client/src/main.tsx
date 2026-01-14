import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, LanguageProvider, SessionProvider, ChatProvider } from './context';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <SessionProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </SessionProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
