import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'

// Public pages
import HomePage           from './pages/HomePage'
import PropertiesPage     from './pages/PropertiesPage'
import PropertyDetailPage from './features/property-detail/PropertyDetailPage'
import ContactPage        from './pages/ContactPage'

// Admin pages
import LoginPage              from './pages/admin/LoginPage'
import AdminPropertiesPage    from './pages/admin/AdminPropertiesPage'
import AdminLocationsPage     from './pages/admin/AdminLocationsPage'
import PropertyFormPage       from './pages/admin/PropertyFormPage'
import ProtectedRoute         from './components/admin/ProtectedRoute'

/**
 * App — Routing completo de la aplicación.
 *
 * Rutas públicas (con Layout):
 *   /                    → HomePage
 *   /properties          → PropertiesPage
 *   /properties/:slug    → PropertyDetailPage
 *   /contact             → ContactPage
 *
 * Rutas admin (sin Layout público):
 *   /login               → LoginPage
 *   /admin               → AdminPropertiesPage  [ProtectedRoute]
 *   /admin/new           → PropertyFormPage     [ProtectedRoute]
 *   /admin/edit/:id      → PropertyFormPage     [ProtectedRoute]
 */
export default function App() {
  return (
    <Routes>
      {/* ── Rutas públicas ── */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/"                   element={<HomePage />} />
              <Route path="/properties"         element={<PropertiesPage />} />
              <Route path="/properties/:slug"   element={<PropertyDetailPage />} />
              <Route path="/contact"            element={<ContactPage />} />
              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
                    <p className="text-8xl font-extrabold text-secondary-200">404</p>
                    <h1 className="text-2xl font-bold text-secondary-700">Página no encontrada</h1>
                    <a href="/" className="px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors">
                      Volver al inicio
                    </a>
                  </div>
                }
              />
            </Routes>
          </Layout>
        }
      />

      {/* ── Login (sin layout público) ── */}
      <Route path="/login" element={<LoginPage />} />

      {/* ── Rutas admin protegidas ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPropertiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <ProtectedRoute>
            <AdminLocationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/new"
        element={
          <ProtectedRoute>
            <PropertyFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute>
            <PropertyFormPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
