import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'
import { ScrollToTop }   from './components/ScrollToTop.jsx'
import { TenantProvider } from './context/TenantContext.jsx'

// Theme injection is now handled inside TenantProvider after the tenant
// is resolved from Supabase — no static injectTheme() call here.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <TenantProvider>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </TenantProvider>
    </BrowserRouter>
  </StrictMode>,
)
