// Safeguard window.fetch against setter errors in sandboxed iframes
try {
  const originalFetch = window.fetch;
  let fetchHolder = originalFetch ? originalFetch.bind(window) : undefined;
  try {
    Object.defineProperty(window, 'fetch', {
      get: () => fetchHolder || originalFetch,
      set: (fn) => {
        fetchHolder = fn;
      },
      configurable: true,
      enumerable: true,
    });
  } catch {
    if (window.Window && Window.prototype) {
      Object.defineProperty(Window.prototype, 'fetch', {
        get: () => fetchHolder || originalFetch,
        set: (fn) => {
          fetchHolder = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch {
  // Ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

