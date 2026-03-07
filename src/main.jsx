import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast/ToastContext'
import { DarkModeProvider } from './components/DarkMode/DarkModeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </DarkModeProvider>
  </StrictMode>,
)
