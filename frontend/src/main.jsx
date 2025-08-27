import { StrictMode } from 'react'
import { Provider } from "@/components/ui/provider"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routesBasic } from '@/routesBasic.jsx'
import { AuthProvider } from '@/store/AuthContext'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <RouterProvider router={routesBasic} />
      </AuthProvider>
    </Provider>
  </StrictMode>
)
