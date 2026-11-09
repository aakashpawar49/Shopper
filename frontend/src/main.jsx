import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store'
import { fetchCart } from './redux/slices/cartSlice'

if (!import.meta.env.VITE_BACKEND_URL) {
  console.error(
    'VITE_BACKEND_URL is not set, so API requests will fail. Copy frontend/.env.example to frontend/.env and restart the dev server.'
  )
}

// Sync the locally stored cart with the server once on start-up
const { user, guestId } = store.getState().auth
store.dispatch(fetchCart({ userId: user?._id, guestId }))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
