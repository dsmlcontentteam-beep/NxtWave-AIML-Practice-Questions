import { Analytics } from '@vercel/analytics/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

createRoot(root).render(
  <StrictMode>
    <App />
    {/* Page views (and, on plans that include them, custom events). No cookies, no personal data. */}
    {__ON_VERCEL__ && <Analytics />}
  </StrictMode>,
);
