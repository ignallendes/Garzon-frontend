import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadConfig } from './api/apiClient'
import { initSocket } from './api/socketClient'

loadConfig().then((cfg) => {
  initSocket(cfg?.socketUrl);

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});