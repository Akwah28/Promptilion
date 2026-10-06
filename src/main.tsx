import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { idb } from './utils/storage';

// Safe recovery for existing bloated localStorage entries from prior sessions
try {
  const existingCreations = localStorage.getItem('promptilion_creations');
  if (existingCreations && existingCreations.length > 1024 * 1024 * 2) {
    // If over 2MB in localStorage, migrate to IndexedDB and remove from localStorage to free quota
    try {
      const parsed = JSON.parse(existingCreations);
      idb.set('promptilion_creations', parsed);
    } catch {
      // ignore
    }
    localStorage.removeItem('promptilion_creations');
  }
} catch {
  // Ignore quota errors on initial check
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
