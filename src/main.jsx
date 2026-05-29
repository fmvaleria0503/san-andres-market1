import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx' // El que vamos a crear ahora
import MisPublicaciones from './pages/MisPublicaciones'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)