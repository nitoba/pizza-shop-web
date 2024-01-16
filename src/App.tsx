import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { Toaster } from './components/ui/sonner'
import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Pizza.Shop" />
      <RouterProvider router={router} />
      <Toaster closeButton richColors />
    </HelmetProvider>
  )
}
