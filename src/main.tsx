import '@fontsource-variable/fraunces';
import '@fontsource-variable/dm-sans';
import './styles/global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { startPwaUpdates } from './services/pwa';

startPwaUpdates();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
