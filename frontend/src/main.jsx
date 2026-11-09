import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (!import.meta.env.VITE_BACKEND_URL) {
  console.error(
    'VITE_BACKEND_URL is not set, so API requests will fail. Copy frontend/.env.example to frontend/.env and restart the dev server.'
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
