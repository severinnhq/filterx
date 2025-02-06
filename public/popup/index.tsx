import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupPage from './PopupPage';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <PopupPage />
  </React.StrictMode>
);