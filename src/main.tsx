import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

Object.defineProperty(window, 'YetAnotherGame', {
  get: function() {
    window.location.href = 'https://justbekirsgame.justbekir.workers.dev';
    return "Opening YetAnotherGame...";
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
