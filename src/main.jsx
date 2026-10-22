import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ExhibitionsProvider } from './context/ExhibitionsContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritesProvider>
      <ExhibitionsProvider>
        <App />
      </ExhibitionsProvider>
    </FavoritesProvider>
  </React.StrictMode>
);