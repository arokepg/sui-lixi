import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SuiProviders } from './config';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';
import './i18n';

// Import dApp Kit styles
import '@mysten/dapp-kit/dist/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SuiProviders>
          <App />
        </SuiProviders>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
