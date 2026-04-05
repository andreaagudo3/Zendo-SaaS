import { Routes, Route } from 'react-router-dom'
import { Layout }    from './components/Layout/Layout'
import { useTenant } from './context/TenantContext'
import { DemoPanel } from './components/shared/DemoPanel'

import SaaSLandingPage from './pages/marketing/SaaSLandingPage'

// Public pages
import HomePage           from './pages/HomePage'
import PropertiesPage     from './pages/PropertiesPage'
import PropertyDetailPage from './features/property-detail/PropertyDetailPage'
import ContactPage        from './pages/ContactPage'

// Admin pages
import LoginPage           from './pages/admin/LoginPage'
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage'
import AdminLocationsPage  from './pages/admin/AdminLocationsPage'
import AdminSettingsPage   from './pages/admin/AdminSettingsPage'
import PropertyFormPage    from './pages/admin/PropertyFormPage'
import ProtectedRoute      from './components/admin/ProtectedRoute'

/**
 * Redirects to the Demo tenant.
 * - Local: /?tenant=demo
 * - Production: https://demo.zendoapp.es
 */
function DemoRedirect() {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const target = isLocal
    ? `${window.location.origin}/?tenant=demo`
    : 'https://demo.zendoapp.es'
  window.location.replace(target)
  return null
}


/**
 * App — Routing completo de la aplicación.
 * Separado en dos mundos: isMaster (Marketing B2B) y Tenant (Real Estate B2C).
 */
export default function App() {
  const tenant = useTenant()
  const isMaster = tenant?.isMaster

  return (
    <>
      {tenant?.isDemoMode && <DemoPanel />}
      <Routes>
        {/* ── Rutas principales con Layout dinámico ── */}
        <Route
          path="/*"
          element={
            <Layout isMarketing={isMaster}>
              <Routes>
                {isMaster ? (
                  // --- MUNDO MARKETING (B2B) ---
                  <Route path="/" element={<SaaSLandingPage />} />
                ) : (
                  // --- MUNDO REAL ESTATE (B2C) ---
                  <>
                    <Route path="/"                 element={<HomePage />} />
                    <Route path="/properties"       element={<PropertiesPage />} />
                    <Route path="/properties/:slug" element={<PropertyDetailPage />} />
                    <Route path="/contact"          element={<ContactPage />} />
                  </>
                )}

                {/* 404 Genérico adaptado */}
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
                      <p className={`text-8xl font-extrabold ${isMaster ? 'text-slate-200' : 'text-secondary-200'}`}>404</p>
                      <h1 className={`text-2xl font-bold ${isMaster ? 'text-slate-700' : 'text-secondary-700'}`}>Página no encontrada</h1>
                      <a href="/" className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                        isMaster ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-primary-700 text-white hover:bg-primary-800'
                      }`}>
                        Volver al inicio
                      </a>
                    </div>
                  }
                />
              </Routes>
            </Layout>
          }
        />

        {/* ── Demo redirect ── */}
        <Route path="/demo" element={<DemoRedirect />} />

        {/* ── Login (sin layout público) ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Rutas admin protegidas ── */}
        <Route path="/admin"           element={<ProtectedRoute><AdminPropertiesPage /></ProtectedRoute>} />
        <Route path="/admin/locations" element={<ProtectedRoute><AdminLocationsPage /></ProtectedRoute>} />
        <Route path="/admin/settings"  element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
        <Route path="/admin/new"       element={<ProtectedRoute><PropertyFormPage /></ProtectedRoute>} />
        <Route path="/admin/edit/:id"  element={<ProtectedRoute><PropertyFormPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
