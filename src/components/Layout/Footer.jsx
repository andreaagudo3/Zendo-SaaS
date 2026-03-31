import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'

/**
 * Footer — 4-column grid with brand, quick links, services, and contact.
 */
export function Footer() {
  const { t } = useTranslation('nav')
  const tenant = useTenant()

  const fullName = tenant?.full_name ?? tenant?.name ?? ''
  const phones = tenant?.phones ?? []
  const socials = tenant?.socials ?? []
  const emailHref = tenant?.email ? `mailto:${tenant.email}` : '#'

  // Usamos el logo de la base de datos, o el por defecto si no hay
  const logoSrc = tenant?.logo_url ?? '/logo.png'

  const QUICK_LINKS = [
    { to: '/', label: t('footer.links.home') },
    { to: '/properties', label: t('footer.links.properties') },
    { to: '/properties?type=sale', label: t('footer.links.sale') },
    { to: '/properties?type=rent', label: t('footer.links.rent') },
    { to: '/contact', label: t('footer.links.contact') },
  ]
  const SERVICES = t('footer.services', { returnObjects: true }) || []

  return (
    <footer className="bg-secondary-950 text-secondary-300 pt-16 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">

          {/* Columna 1 — Marca */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity" aria-label={`${fullName} – Inicio`}>
              <img
                src={logoSrc}
                alt={fullName}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-secondary-400 leading-relaxed">
              {t('footer.description', { zone: tenant?.zone, province: tenant?.province })}
            </p>
            <div className="flex gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${social.name}`}
                  className="h-9 w-9 rounded-lg bg-secondary-800 text-secondary-300 hover:text-white hover:bg-primary-700 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-bold">{social.name[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 — Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.nav')}
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-secondary-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Servicios */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.servicesTitle', 'Servicios')}
            </h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s} className="text-sm text-secondary-400">{s}</li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h3>
            <address className="not-italic space-y-3 text-sm text-secondary-400">
              {tenant?.address && (
                <p>{tenant.address}</p>
              )}

              {/* FIX: Mapeo de teléfonos corregido para array de strings */}
              {phones.length > 0 && (
                <p>
                  {phones.map((p, i) => (
                    <span key={i}>
                      <a
                        href={`tel:${p.replace(/\s+/g, '')}`}
                        className="hover:text-primary-400 transition-colors"
                      >
                        {p}
                      </a>
                      {i < phones.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}

              {tenant?.email && (
                <p>
                  <a href={emailHref} className="hover:text-primary-400 transition-colors">
                    {tenant.email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-secondary-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
          <p>{t('footer.copyright', { year: new Date().getFullYear(), name: fullName })}</p>
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