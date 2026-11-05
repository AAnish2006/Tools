import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './style.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const appElement = (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, appElement);
  } else {
    ReactDOM.createRoot(rootElement).render(appElement);
  }
}
