import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'
import { useThemeStore } from '../../store/themeStore'

/**
 * Navbar — Barra de navegación adaptable por tema.
 * Ahora MINIMAL y PORTAL comparten dimensiones compactas.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation('nav')
  const theme = useThemeStore((s) => s.theme)
  const tenant = useTenant()

  const isMinimal = theme === 'MINIMAL'
  const isCorporate = theme === 'CORPORATE'
  const isPortal = theme === 'PORTAL'

  // Definimos si el diseño debe ser compacto (Minimal y Portal lo son)
  const isCompact = isPortal || isMinimal

  const NAV_LINKS = [
    { to: '/', label: t('navbar.home') },
    { to: '/properties', label: t('navbar.properties') },
    { to: '/contact', label: t('navbar.contact') },
  ]

  // El estilo de fondo/posicionamiento sigue siendo distinto, pero el tamaño no
  const headerClass = isMinimal
    ? 'fixed w-full top-0 z-50 glass border-b border-white/20'
    : 'sticky top-0 z-50 bg-white shadow-sm border-b border-secondary-200'

  // Unificamos altura (h-14 para compactos)
  const navClass = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${isCompact ? 'h-14' : 'h-16 md:h-20'
    }`

  // Unificamos tamaño de logo
  const logoClass = `w-auto object-contain ${isCompact ? 'h-6 md:h-7 max-h-[28px]' : 'h-8 md:h-9 max-h-[36px]'
    }`

  const fullName = tenant?.full_name ?? tenant?.name ?? ''
  const emailHref = tenant?.email ? `mailto:${tenant.email}` : '#'

  // Extraemos el primer teléfono de forma segura (array de strings)
  const firstPhone = tenant?.phones?.[0]
  const firstPhoneHref = firstPhone ? `tel:${firstPhone.replace(/\s+/g, '')}` : '#'

  return (
    <>


      <header className={headerClass} role="banner">
        {/* ── Corporate TopBar ── */}
        {isCorporate && (
          <div className="bg-secondary-900 text-secondary-100 text-xs py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center transition-colors">
            <div className="flex gap-4">
              <a href={emailHref} className="hover:text-white transition-colors">{tenant?.email}</a>
              {firstPhone && (
                <a href={firstPhoneHref} className="hover:text-white transition-colors">
                  {firstPhone}
                </a>
              )}
            </div>
            <div className="hidden sm:block">{tenant?.address}</div>
          </div>
        )}

        <nav className={navClass} role="navigation" aria-label={t('navbar.ariaLabel')}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label={t('navbar.logoAriaLabel', { name: fullName })}
          >
            <img
              src={tenant?.isMaster ? '/zendo-logo.png' : (tenant?.logo_url ?? '/logo.png')}
              alt={fullName}
              className={logoClass}
            />
            {tenant?.isMaster && (
              <span className={`font-bold tracking-tight text-slate-900 ${isCompact ? 'text-lg' : 'text-xl'}`}>
                Zendo
              </span>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-950 hover:bg-secondary-100'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/properties"
              className="px-5 py-2 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 transition-colors shadow-sm"
              aria-label={t('navbar.properties')}
            >
              {t('navbar.properties')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-950 hover:bg-secondary-100 transition-colors"
            aria-label={menuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className={`md:hidden border-t pt-3 px-3 pb-6 space-y-1 transition-all duration-300 ${isMinimal
              ? 'border-white/20 glass'
              : 'bg-white border-secondary-200 shadow-xl'
              }`}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                    ? 'bg-primary-50 text-primary-700' // Un tono más suave para que no sature
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-950'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Idioma + Botón de Propiedades en móvil */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-center py-1">
                <LanguageSwitcher />
              </div>
              <Link
                to="/properties"
                onClick={() => setMenuOpen(false)}
                className="block w-full py-3.5 rounded-xl bg-primary-700 text-white text-base font-semibold text-center hover:bg-primary-800 active:scale-[0.98] transition-all shadow-md"
              >
                {t('navbar.properties')}
              </Link>
            </div>

          </div>
        )}
      </header>
    </>
  )
}