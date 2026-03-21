import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MBTIProvider } from './context/ScoreContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MBTIProvider>
      <App />
    </MBTIProvider>
  </StrictMode>,
)
