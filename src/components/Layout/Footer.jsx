import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SITE } from '../../config/siteConfig'

/**
 * Footer — 3-column grid with brand, quick links, and contact.
 */
export function Footer() {
  const { t } = useTranslation('nav')

  const QUICK_LINKS = [
    { to: '/',                       label: t('footer.links.home') },
    { to: '/properties',             label: t('footer.links.properties') },
    { to: '/properties?type=sale',   label: t('footer.links.sale') },
    { to: '/properties?type=rent',   label: t('footer.links.rent') },
    { to: '/contact',                label: t('footer.links.contact') },
  ]

  return (
    <footer className="bg-secondary-950 text-secondary-300 pt-16 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity" aria-label={`${SITE.fullName} – Inicio`}>
              <img
                src="/logo.png"
                alt={SITE.fullName}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-secondary-400 leading-relaxed">
              {t('footer.description', { zone: SITE.zone, province: SITE.province })}
            </p>
            {/* Social icons (Ocultos temporalmente por si se usan en el futuro)
            <div className="flex gap-3 pt-2">
              {SITE.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={`Síguenos en ${social.name}`}
                  className="h-9 w-9 rounded-lg bg-secondary-800 hover:bg-primary-700 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-bold text-secondary-300">{social.name[0]}</span>
                </a>
              ))}
            </div>
            */}
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.nav')}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-secondary-400 hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h3>
            <address className="not-italic space-y-3 text-sm text-secondary-400">
              <p>{SITE.zone}<br />{SITE.province}, {SITE.country}</p>
              <p>
                {SITE.phones.map((p, i) => (
                  <span key={p.href}>
                    <a href={p.href} className="hover:text-primary-400 transition-colors">
                      {p.number}
                    </a>
                    {i < SITE.phones.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p>
                <a href={SITE.email.href} className="hover:text-primary-400 transition-colors">
                  {SITE.email.address}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-secondary-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
          <p>{t('footer.copyright', { year: new Date().getFullYear(), name: SITE.fullName })}</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-secondary-300 transition-colors">{t('footer.privacy')}</Link>
            <Link to="#" className="hover:text-secondary-300 transition-colors">{t('footer.cookies')}</Link>
            <Link to="#" className="hover:text-secondary-300 transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
