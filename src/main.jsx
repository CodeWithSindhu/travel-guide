import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

import { WishlistProvider } from './context/WishlistContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
