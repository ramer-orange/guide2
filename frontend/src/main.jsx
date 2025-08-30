import { StrictMode } from 'react'
import { Provider } from "@/components/ui/provider"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routesBasic } from '@/routesBasic.jsx'
import { AuthProvider } from '@/store/AuthContext'
import { ToastProvider } from '@/components/ui/ToastProvider'; // ToastProviderをインポート
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={routesBasic} />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
)
