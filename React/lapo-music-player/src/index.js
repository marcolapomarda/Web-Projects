import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { SpotifyDataProvider } from './contexts/SpotifyDataContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <SpotifyDataProvider>
      <App />
    </SpotifyDataProvider>
  </Router>
);
