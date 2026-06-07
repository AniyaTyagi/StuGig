window.addEventListener('error', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.background = '#ffebee';
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.border = '1px solid red';
  errorDiv.style.borderRadius = '8px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.position = 'relative';
  errorDiv.innerHTML = `<h3>Application Runtime Error</h3><p>${event.message}</p><pre>${event.error?.stack || 'No stack trace available'}</pre>`;
  document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.background = '#ffebee';
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.border = '1px solid red';
  errorDiv.style.borderRadius = '8px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.position = 'relative';
  errorDiv.innerHTML = `<h3>Unhandled Promise Rejection</h3><p>${event.reason?.message || event.reason}</p><pre>${event.reason?.stack || 'No stack trace available'}</pre>`;
  document.body.appendChild(errorDiv);
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
