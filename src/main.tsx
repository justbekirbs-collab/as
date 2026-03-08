import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

Object.defineProperty(window, 'YetAnotherGame', {
  get: function() {
    window.location.href = 'https://github.com/justbekirbs-collab/justbekirsgame.git';
    return "Opening YetAnotherGame...";
  }
});

Object.defineProperty(window, 'rentagf', {
  get: function() {
    window.location.href = 'https://static0.cbrimages.com/wordpress/wp-content/uploads/2023/06/rent-a-girlfriend-season-3-visual.jpg?w=1200&h=675&fit=crop';
    return "Opening Rent-a-Girlfriend visual...";
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
