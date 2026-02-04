import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SuiProviders } from './config';
import App from './App';
import './index.css';

// Import dApp Kit styles
import '@mysten/dapp-kit/dist/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SuiProviders>
        <App />
      </SuiProviders>
    </BrowserRouter>
  </StrictMode>
);
