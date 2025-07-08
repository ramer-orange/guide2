import { StrictMode } from 'react'
import { Provider } from "./components/ui/provider"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routesBasic } from './routes/routesBasic.jsx'
import { AuthProvider } from './contexts/AuthContext'
// import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <RouterProvider router={routesBasic} />
      </AuthProvider>
    </Provider>
  </StrictMode>
)
