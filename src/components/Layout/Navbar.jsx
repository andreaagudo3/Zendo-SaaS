import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SITE } from '../../config/siteConfig'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'

/**
 * Navbar — sticky glassmorphism navigation bar.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation('nav')

  const NAV_LINKS = [
    { to: '/',           label: t('navbar.home') },
    { to: '/properties', label: t('navbar.properties') },
    { to: '/contact',    label: t('navbar.contact') },
  ]

  return (
    <header
      className="sticky top-0 z-50 glass border-b border-white/30 shadow-sm"
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        role="navigation"
        aria-label={t('navbar.ariaLabel')}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label={t('navbar.logoAriaLabel', { name: SITE.fullName })}
        >
          <img
            src="/logo.png"
            alt={SITE.fullName}
            className="h-8 md:h-9 max-h-[36px] w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
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
        <div className="md:hidden border-t border-white/30 glass px-4 pb-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-950'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/properties"
            onClick={() => setMenuOpen(false)}
            className="block mt-2 px-4 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold text-center hover:bg-primary-800 transition-colors"
          >
            {t('navbar.properties')}
          </Link>
        </div>
      )}
    </header>
  )
}
