import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ActionProvider } from './actions';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ActionProvider>
      <App />
    </ActionProvider>
  </React.StrictMode>
);
