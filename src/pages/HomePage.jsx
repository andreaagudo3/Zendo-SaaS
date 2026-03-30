import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePropertiesStore } from '../store/propertiesStore'
import { useProperties } from '../services/useProperties'
import { getProvincesWithLocations } from '../services/propertyService'
import { PropertyCard } from '../components/shared/PropertyCard'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { HierarchicalLocationSelect } from '../components/search/HierarchicalLocationSelect'
import { useTenant }    from '../context/TenantContext'
import { useThemeStore } from '../store/themeStore'

/**
 * HomePage — Hero + Search + Featured Properties
 */
export default function HomePage() {
  const store = usePropertiesStore()
  useProperties(store)
  const { t } = useTranslation(['home', 'common'])

  const [locationFilter, setLocationFilter] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [provinces, setProvinces] = useState([])
  const navigate = useNavigate()

  const featuredProperties = store.properties.filter((p) => p.featured)

  useEffect(() => {
    getProvincesWithLocations().then(setProvinces)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (activeType !== 'all') params.set('type', activeType)
    if (locationFilter !== 'all') params.set('loc', locationFilter)
    navigate(`/properties?${params.toString()}`)
  }

  const TYPE_OPTIONS = [
    { value: 'all', label: t('common:listing.all') },
    { value: 'sale', label: t('common:listing.sale') },
    { value: 'rent', label: t('common:listing.rent') },
  ]

  const tenant = useTenant()
  const theme = useThemeStore((s) => s.theme)
  const isMinimal   = theme === 'MINIMAL'
  const isCorporate = theme === 'CORPORATE'
  const isPortal    = theme === 'PORTAL'

  const renderSearchForm = (layoutType) => {
    const isCorp = layoutType === 'CORPORATE'
    const isPort = layoutType === 'PORTAL'
    const isMin = layoutType === 'MINIMAL'

    return (
      <form
        onSubmit={handleSearch}
        className={`w-full ${isCorp ? 'max-w-xl' : isPort ? 'max-w-4xl' : 'max-w-2xl'} ${isCorp ? '' : 'mx-auto'}`}
        role="search"
        aria-label={t('home:hero.searchAriaLabel')}
      >
        <div className={`flex gap-2 mb-4 ${isCorp ? 'justify-start' : 'justify-center'}`}>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveType(value)}
              aria-pressed={activeType === value}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeType === value
                  ? 'bg-primary-700 text-white'
                  : isCorp
                    ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    : 'bg-white/10 text-secondary-300 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${
            isMin ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2' : ''
          } ${isPort ? 'bg-white p-2 sm:p-3 rounded-2xl sm:rounded-[2rem] shadow-xl' : ''}`}
        >
          <div className="relative flex-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 h-5 w-5 text-secondary-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <HierarchicalLocationSelect
              provinces={provinces}
              value={locationFilter}
              onChange={setLocationFilter}
              allLabel={t('common:location.any')}
              className={`w-full pl-11 pr-4 py-3 sm:py-4 text-sm focus:outline-none transition-colors ${
                isCorp
                  ? 'bg-white text-secondary-900 rounded-xl border border-secondary-200 shadow-sm focus:ring-2 focus:ring-primary-500'
                  : isPort
                  ? 'bg-secondary-50 text-secondary-900 rounded-xl sm:rounded-2xl border border-transparent focus:bg-white focus:border-secondary-200 focus:ring-2 focus:ring-primary-500'
                  : 'bg-transparent text-white placeholder-secondary-300 [&>option]:text-secondary-900 [&>optgroup]:text-secondary-500'
              }`}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-3 sm:py-4 font-bold text-white transition-colors bg-primary-700 hover:bg-primary-800 ${
              isPort ? 'rounded-xl sm:rounded-2xl text-base px-8' : 'rounded-xl text-sm'
            }`}
            aria-label={t('home:hero.searchAriaLabel')}
          >
            {t('common:btn.search')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      {/* ── MINIMAL Hero ────────────────────────────────────────────── */}
      {isMinimal && (
        <section className="relative bg-secondary-950 overflow-hidden" aria-labelledby="hero-heading">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/80 via-secondary-950/60 to-secondary-950" aria-hidden="true" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center space-y-8">
            <div className="flex flex-col items-center justify-center gap-8 mb-10 md:mb-16">
              <img src="/logo.png" alt={t('home:hero.logoAlt', { name: tenant?.name })} className="h-16 md:h-20 max-h-[80px] w-auto object-contain brightness-0 invert" />
              <p className="inline-block px-4 py-1.5 rounded-full bg-primary-700/20 text-primary-300 text-sm font-medium tracking-wide border border-primary-600/30">
                {t('home:hero.eyebrow', { zone: tenant?.zone, province: tenant?.province })}
              </p>
            </div>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
              {t('home:hero.title')}
              <span className="block text-primary-400 mt-1">{t('home:hero.titleSpan', { zone: tenant?.zone })}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-secondary-300">
              {t('home:hero.subtitle')}
            </p>
            {renderSearchForm('MINIMAL')}
          </div>
        </section>
      )}

      {/* ── CORPORATE Hero ────────────────────────────────────────────── */}
      {isCorporate && (
        <section className="bg-white border-b border-secondary-200" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Left: Text & Search (Order 2 on mobile, 1 on desktop) */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <p className="text-primary-700 font-bold tracking-widest uppercase text-xs sm:text-sm mb-4">
                  {t('home:hero.eyebrow', { zone: tenant?.zone, province: tenant?.province })}
                </p>
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary-950 leading-tight mb-6">
                  {t('home:hero.title')}
                  <span className="block text-primary-700 mt-2">{t('home:hero.titleSpan', { zone: tenant?.zone })}</span>
                </h1>
                <p className="text-lg text-secondary-600 mb-10 max-w-lg leading-relaxed">
                  {t('home:hero.subtitle')}
                </p>
                {renderSearchForm('CORPORATE')}
              </div>

              {/* Right: Architectural Image Block (Order 1 on mobile, 2 on desktop) */}
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                  {/* Decorative offset block */}
                  <div className="absolute inset-0 bg-secondary-100 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6" aria-hidden="true" />
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                    alt={t('home:hero.logoAlt', { name: tenant?.name })} 
                    className="absolute inset-0 w-full h-full object-cover border border-secondary-200 z-10"
                  />
                  {/* Small architectural badge */}
                  <div className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 z-20 bg-primary-700 text-white p-4 hidden sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── PORTAL Hero ─────────────────────────────────────────────── */}
      {isPortal && (
        <section className="relative bg-secondary-900 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')" }} aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col items-center">
             <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
               {t('home:hero.title')} <span className="text-primary-400">{t('home:hero.titleSpan', { zone: tenant?.zone })}</span>
             </h1>
             <p className="text-lg sm:text-xl text-secondary-100 mb-10 md:mb-14 text-center max-w-3xl drop-shadow-md">
               {t('home:hero.subtitle')}
             </p>
             <div className="w-full max-w-4xl bg-secondary-950/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl">
               {renderSearchForm('PORTAL')}
             </div>
          </div>
        </section>
      )}


      {/* ── Featured Properties ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="featured-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary-700 font-semibold text-sm tracking-wide uppercase mb-1">
              {t('home:featured.eyebrow')}
            </p>
            <h2 id="featured-heading" className="text-3xl md:text-4xl font-bold text-secondary-950">
              {t('home:featured.title')}
            </h2>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-secondary-100 text-secondary-800 font-bold hover:bg-secondary-200 transition-colors"
          >
            {t('common:btn.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {store.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : store.error ? (
          <div className="text-center py-16 text-red-500">{store.error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="bg-secondary-950 py-20" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white">
            {t('home:cta.title')}
          </h2>
          <p className="text-secondary-400 text-lg">
            {t('home:cta.subtitle')}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 rounded-2xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition-colors text-lg"
            aria-label={t('home:cta.btnAriaLabel')}
          >
            {t('home:cta.btn')}
          </a>
        </div>
      </section>
    </>
  )
}
