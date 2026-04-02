import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../../services/adminService'
import { useTenant } from '../../context/TenantContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Propiedades', icon: '🏠' },
  { to: '/admin/locations', label: 'Ubicaciones', icon: '📍' },
  { to: '/admin/settings', label: 'Perfil / SEO', icon: '⚙️' },
]

/**
 * AdminLayout — Wrapper para todas las páginas del panel admin.
 * Header con logo, nombre de sección activa y botón logout.
 */
export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const tenant = useTenant()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-secondary-100 flex flex-col">
      {/* Header */}
      <header className="bg-secondary-950 border-b border-secondary-800 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={tenant?.logo_url || '/zendo-logo.png'}
              alt={tenant?.name ?? ''}
              className="h-8 w-auto object-contain"
            />
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
              {tenant?.name || 'Zendo'}
            </span>
          </div>
          <span className="text-secondary-400 text-sm font-medium hidden md:block">Panel Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === to
                  ? 'bg-primary-700 text-white'
                  : 'text-secondary-400 hover:text-white hover:bg-secondary-800'
                }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:block">Salir</span>
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
